import { Alert, AlertColor } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export type AlertMessage = {
	message: string;
	severity: AlertColor;
};

export const CustomAlert = ({
	alert,
	children,
}: {
	alert: AlertMessage;
	children: ReactNode;
}): ReactElement => {
	return (
		<Alert severity={alert.severity} sx={{ width: "100%" }}>
			{alert.message}
			{children}
		</Alert>
	);
};
