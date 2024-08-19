"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context)
    throw new Error("Use session must be used with session provider");

  return context;
};
