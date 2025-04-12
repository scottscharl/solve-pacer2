import React from "react";
import { PocketContext } from "@/contexts/PocketContext";

// Custom hook to simplify using the Pocket context
export function usePocket() {
  return React.useContext(PocketContext);
}
