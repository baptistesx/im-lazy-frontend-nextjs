import { createContext } from "react";

export interface AlertContextInterface {
  addAlert: Function;
}

export const SnackbarContext = createContext<AlertContextInterface | null>(
  null
);
