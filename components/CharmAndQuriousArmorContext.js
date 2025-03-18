import React, { createContext, useState, useContext } from "react";

export const CharmAndQuriousArmorContext = createContext();

export function useCharmAndQuriousArmorContext() {
  return useContext(CharmAndQuriousArmorContext);
}
