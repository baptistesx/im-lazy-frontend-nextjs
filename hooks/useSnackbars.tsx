import { useContext } from "react";

import { SnackbarContext } from "../contexts/snackbarContext";

const useSnackbars = () => useContext(SnackbarContext);

export default useSnackbars;
