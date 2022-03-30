import { SnackbarMessage } from "@components/layout/snackbar.d";

export type SnackbarContextInterface = {
	addSnackbar: (snackbar: SnackbarMessage) => void;
};

export const AUTO_DISMISS_MS = 5000;
