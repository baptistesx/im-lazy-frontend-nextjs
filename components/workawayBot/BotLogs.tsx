import { LoadingButton } from "@mui/lab";
import { Box, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { useSnackbars } from "../../providers/SnackbarProvider";
import { clearLogs, setCity } from "../../services/workawayBotApi";
import { ENDPOINT } from "../../utils/constants";
import CitiesFormDialog from "./CitiesFormDialog";

let botLogsMessageSentIsFirst = true;

const BotLogs = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketInitialized, setIsSocketInitialized] =
    useState<boolean>(false);

  const snackbarsService = useSnackbars();

  const [botLogs, setBotLogs] = useState<string[]>([]);

  const [isClearingLogs, setIsClearingLogs] = useState<boolean>(false);

  const [isCitiesDialogOpen, setIsCitiesDialogOpen] = useState<boolean>(false);

  const [fullCitySelected, setFullCitySelected] = useState<string>("");

  const [cities, setCities] = useState<string[]>([]);

  const handleOpenCitiesDialog = (citiesArray: string[]) => {
    setCities(citiesArray);

    setIsCitiesDialogOpen(true);
  };

  const handleCloseCitiesDialog = async (city: string) => {
    setIsCitiesDialogOpen(false);

    if (city) {
      setFullCitySelected(city);

      await setCity(city).catch((err: Error) => {
        snackbarsService?.addAlert({
          message:
            "An error occured while setting the city/country name, are you a premium member?",
          severity: "error",
        });
      });
    }
  };

  useEffect(() => {
    if (socket === null) {
      setSocket(socketIOClient(ENDPOINT as any));
    }

    if (socket !== null && !isSocketInitialized) {
      setIsSocketInitialized(true);

      socket.on("connection", (log: string) => {
        setBotLogs((logs: string[]) => [...logs, log]);

        scrollLogsDown();
      });

      socket.on("botLogs", (log: string) => {
        if (log.constructor === Array) {
          setBotLogs((logs) => [logs[0], ...log]);
        } else {
          setBotLogs((logs) => [...logs, log]);
        }

        scrollLogsDown();
      });

      socket.on("botLogsMessageSent", (log: string) => {
        if (botLogsMessageSentIsFirst) {
          setBotLogs((logs) => [...logs, log]);
          botLogsMessageSentIsFirst = false;
        } else {
          setBotLogs((logs) => [...logs.slice(0, -1), log]);
        }

        scrollLogsDown();
      });

      socket.on("citiesList", async (cities: string[]) =>
        handleOpenCitiesDialog(cities)
      );
    }
  }, [socket, isSocketInitialized]);

  const handleClickClearConsole = async () => {
    setIsClearingLogs(true);

    clearLogs((res: { status: number }) => {
      if (res.status === 200) {
        setBotLogs((logs) => []);
      }

      setIsClearingLogs(false);
    }).catch((err: Error) => {
      setIsClearingLogs(false);

      snackbarsService?.addAlert({
        message:
          "An error occured while clearing logs, are you a premium member?",
        severity: "error",
      });
    });
  };

  const scrollLogsDown = () => {
    var elem: any = document.querySelector("#logs");

    if (elem) {
      elem.scrollTop = elem?.scrollHeight;
    }
  };

  return (
    <Card
      id="logs"
      sx={{
        width: "45%",
        minWidth: 320,
        minHeight: 400,
        maxHeight: "80vh",
        m: 1,
        p: 1,
        bgcolor: "#353b48",
        color: "#ffffff",
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <Box>
        {botLogs.map((log, index) => (
          <Typography key={log + index}>{log}</Typography>
        ))}
      </Box>

      <LoadingButton
        variant="contained"
        loading={isClearingLogs}
        sx={{
          m: 1,
        }}
        disabled={false}
        onClick={handleClickClearConsole}
      >
        Clear logs
      </LoadingButton>

      <CitiesFormDialog
        keepMounted
        open={isCitiesDialogOpen}
        onClose={handleCloseCitiesDialog}
        value={fullCitySelected}
        cities={cities}
      />
    </Card>
  );
};

export default BotLogs;
