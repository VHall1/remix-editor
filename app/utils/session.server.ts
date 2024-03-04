import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { type Session } from "./session";

const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__vhall1-session",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // 14 days in seconds
    maxAge: 60 * 60 * 24 * 14,
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export async function getSessionStorage(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return {
    // User session data
    getSession: (): Session | undefined => {
      return session.get("session");
    },
    setSession: (userSession: Session | undefined) => {
      session.set("session", userSession);
    },

    // // Randomly generated nonce
    // getState: (): OAuthState | undefined => {
    //   const state = session.get("state");
    //   if (!state) return state;
    //   return jwt.verify(state, constants.AUTH_JWT_SECRET);
    // },
    // setState: (state: OAuthState | undefined) => {
    //   const signedState = jwt.sign(state, constants.AUTH_JWT_SECRET, {
    //     // 5 minutes in seconds
    //     expiresIn: 60 * 5,
    //   });
    //   session.set("state", signedState);
    // },

    // Helpers - commit changes and destroy session cookie
    commit: () => sessionStorage.commitSession(session),
    destroy: () => sessionStorage.destroySession(session),
  };
}

export async function requireUserSession(request: Request) {
  const { getSession } = await getSessionStorage(request);
  const session = getSession();

  if (!session) {
    throw redirect("/auth");
  }

  return session;
}
