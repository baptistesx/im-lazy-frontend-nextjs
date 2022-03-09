import { useState, useEffect } from "react";
import {
  SnackbarContext,
  AlertContextInterface,
} from "../contexts/snackbarContext";
import { Snackbar, Alert, Box, AlertColor } from "@mui/material";

const AUTO_DISMISS = 5000;

export type Alert = {
  message: string;
  severity: AlertColor;
};
export function SnackBarProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const activeAlertIds = alerts.join(",");

  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)),
        AUTO_DISMISS
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

  const addAlert = (alert: Alert) => {
    console.log(alert);
    setAlerts((alerts: Alert[]) => [alert, ...alerts]);
  };

  const alertContext: AlertContextInterface = {
    addAlert: addAlert,
  };

  return (
    <SnackbarContext.Provider value={alertContext}>
      {children}
      {alerts.map((alert, index) => (
        <Box>
          <Snackbar key={alert.message + index} open={true}>
            <Alert severity={alert.severity} sx={{ width: "100%" }}>
              {alert.message}
            </Alert>
          </Snackbar>
        </Box>
      ))}
    </SnackbarContext.Provider>
  );
}
