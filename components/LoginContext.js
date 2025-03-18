import React, { createContext, useState, useContext } from "react";

export const LoginContext = createContext();

export function useLoginContext() {
  return useContext(LoginContext);
}
