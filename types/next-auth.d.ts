import "next-auth"

declare module "next-auth" {
  interface User {
    isInternal?: boolean
  }

  interface Session {
    user: User & {
      isInternal?: boolean
    }
  }
}
