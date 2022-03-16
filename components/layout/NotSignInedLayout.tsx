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
    <Box sx={{ display: "flex", height: "100%", flexWrap: "wrap" }}>
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          height: { xs: "20%", sm: "100%" },
          backgroundColor: { xs: theme.palette.primary.main, sm: "white" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href={router.route !== "/" ? "/" : "#"}>
          <Button sx={{ height: 150, display: { xs: "block", sm: "none" } }}>
            <Image src="/logo-light.png" height={100} width={200} />
          </Button>
          <Button sx={{ height: 150, display: { xs: "none", sm: "block" } }}>
            <Image src="/logo-dark-400-200.png" height={100} width={200} />
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          height: { xs: "80%", sm: "100%" },
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 5,
          p: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NotSignedInLayout;
