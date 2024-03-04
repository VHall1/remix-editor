import { useFetcher } from "@remix-run/react";
import * as React from "react";

export interface Session {
  id: string;
  username: string;
}

interface UserContextType {
  session: Session | null;
  logout: () => void;
}

const SessionContext = React.createContext<UserContextType | null>(null);

interface UserProviderProps {
  session: Session | null;
}

export function SessionProvider({
  children,
  session = null,
}: React.PropsWithChildren<UserProviderProps>) {
  const fetcher = useFetcher();
  const [sessionInState, setSessionInState] =
    React.useState<UserContextType["session"]>(session);

  const logout = () => {
    fetcher.submit({}, { action: "/auth/logout", method: "POST" });
    setSessionInState(null);
  };

  return (
    <SessionContext.Provider
      value={{
        session: sessionInState,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (ctx === undefined) {
    throw new Error("useSession hook must be used within a SessionProvider");
  }
  return ctx;
}
