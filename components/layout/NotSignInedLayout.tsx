import { useTheme } from "@emotion/react";
import { Box, Button, Link } from "@mui/material/";
import { Theme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const NotSignedInLayout = ({ children }: { children: React.ReactNode }) => {
  const theme: Theme = useTheme();
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box
        sx={{
          width: "50%",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href={router.route !== "/" ? "/" : "#"}>
          <Button sx={{ height: 150 }}>
            <Image
              src="/imlazy-logo-dark-400-200.png"
              height={150}
              width={300}
            />
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          width: "50%",
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 5,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NotSignedInLayout;
