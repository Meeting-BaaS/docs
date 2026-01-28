import { auth, signOut } from "@/auth"
import { ShieldX } from "lucide-react"
import Link from "next/link"

export default async function AccessDeniedPage() {
  const session = await auth()

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <ShieldX className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-semibold">Access Denied</h1>
        <p className="mb-4 text-fd-muted-foreground">
          Internal documentation is restricted to Meeting BaaS team members.
        </p>

        {session?.user?.email && (
          <p className="mb-6 text-sm text-fd-muted-foreground">
            Signed in as: <code className="rounded bg-fd-muted px-1">{session.user.email}</code>
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-fd-border px-6 py-2.5 font-medium transition-colors hover:bg-fd-accent"
          >
            Go to Public Docs
          </Link>

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-fd-muted px-6 py-2.5 font-medium transition-colors hover:bg-fd-accent"
            >
              Sign Out
            </button>
          </form>
        </div>

        <p className="mt-8 text-sm text-fd-muted-foreground">
          Need access? Contact your team administrator.
        </p>
      </div>
    </main>
  )
}
