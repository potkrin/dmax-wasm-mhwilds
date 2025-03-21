import React, { createContext, useState, useContext } from "react";

export const ArtianContext = createContext();

export function useArtianContext() {
  return useContext(ArtianContext);
}
