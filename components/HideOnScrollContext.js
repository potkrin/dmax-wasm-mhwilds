import React, { createContext, useContext, useState } from "react";

export const HideOnScrollContext = createContext();

export function useHideOnScroll() {
  return useContext(HideOnScrollContext);
}
