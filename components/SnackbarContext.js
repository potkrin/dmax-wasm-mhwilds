import React, { createContext, useState, useContext } from "react";

export const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}
