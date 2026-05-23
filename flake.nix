{
  description = "meetingbaas-docs — Meeting BaaS documentation (fumadocs / Next.js, pnpm, standalone)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" ];
      forAll = nixpkgs.lib.genAttrs systems;
      pkgsFor = s: nixpkgs.legacyPackages.${s};
    in {
      # Fumadocs site (pnpm 10, Next standalone). No next/font/google, so the
      # build is hermetic without bundling fonts.
      #
      # We do NOT run `pnpm build` (= transpile && build:pre && next build &&
      # build:post): build:pre's generate-sdk-updates fetches
      # registry.npmjs.org, and build:post's generate-updates runs `git add`
      # against the worktree — neither works in the sandbox. The served content
      # (content/docs/**, content/llm/**, the API reference generated from the
      # committed openapi*.json) is all committed, so the hermetic build is just
      # `fumadocs-mdx` (regenerates the gitignored .source index) + `next build`.
      packages = forAll (s:
        let pkgs = pkgsFor s; in {
          default = pkgs.stdenv.mkDerivation (finalAttrs: {
            pname = "meeting-baas-docs";
            version = "0.1.0";
            src = ./.;
            nativeBuildInputs = [ pkgs.nodejs_22 pkgs.pnpm_10 pkgs.pnpmConfigHook pkgs.makeWrapper ];
            pnpmDeps = (pkgs.fetchPnpmDeps.override { pnpm = pkgs.pnpm_10; }) {
              inherit (finalAttrs) pname version src;
              fetcherVersion = 2;
              hash = "sha256-MCBaYkYNr/+rt0dqaBs7LOGasjR71vq8oNxE64UwDqM=";
            };
            env = {
              NEXT_TELEMETRY_DISABLED = "1";
              CI = "true";
              # Orama Cloud search: components/search.tsx throws at build time
              # (prerender) unless these are set. They are NEXT_PUBLIC_* client
              # read keys — inlined into the browser bundle and served to every
              # visitor — so baking them here is not a secret leak. The private
              # index-write key is only used by the (out-of-build) update scripts.
              NEXT_PUBLIC_ORAMA_PROJECT_ID = "d0dd844f-8142-4391-8723-91dffd9db5a7";
              NEXT_PUBLIC_ORAMA_API_KEY = "c1_v_X2X0I3Hll3DjoGtYV7hTkJUncZ5MA9H-86dmxrIE9c6uBKO3j-wWB8nZ5";
            };
            buildPhase = ''
              runHook preBuild
              pnpm exec fumadocs-mdx
              pnpm exec next build
              runHook postBuild
            '';
            installPhase = ''
              runHook preInstall
              dir=$out/share/meeting-baas-docs
              mkdir -p "$dir/.next"
              cp -r .next/standalone/. "$dir"/
              cp -r .next/static "$dir/.next/static"
              [ -d public ] && cp -r public "$dir/public" || true
              # Next's standalone tracer leaves dangling platform/optional
              # symlinks; prune so noBrokenSymlinks passes.
              find "$dir" -xtype l -delete
              makeWrapper ${pkgs.nodejs_22}/bin/node $out/bin/meeting-baas-docs \
                --add-flags "$dir/server.js"
              runHook postInstall
            '';
          });
        });
      overlays.default = final: prev: {
        meeting-baas-docs = self.packages.${final.system}.default;
      };
    };
}
