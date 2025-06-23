import React, { createContext, useContext, useState } from "react";

const AuthScreenContext = createContext();

export function AuthScreenProvider({ children }) {
  const [authScreen, setAuthScreen] = useState("login");

  return (
    <AuthScreenContext.Provider value={{ authScreen, setAuthScreen }}>
      {children}
    </AuthScreenContext.Provider>
  );
}

export function useAuthScreen() {
  return useContext(AuthScreenContext);
}
