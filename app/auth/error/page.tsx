import { AlertTriangle } from "lucide-react"
import Link from "next/link"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have access to this resource.",
  Verification: "The verification link has expired or has already been used.",
  NoEmail: "Could not retrieve email from your account.",
  Default: "An error occurred during authentication.",
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error || "Default"
  const message = errorMessages[error] || errorMessages.Default

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-yellow-500/10 p-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-semibold">Authentication Error</h1>
        <p className="mb-8 text-fd-muted-foreground">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-fd-border px-6 py-2.5 font-medium transition-colors hover:bg-fd-accent"
          >
            Go Home
          </Link>
        </div>

        {error !== "Default" && (
          <p className="mt-6 text-xs text-fd-muted-foreground">
            Error code: {error}
          </p>
        )}
      </div>
    </main>
  )
}
