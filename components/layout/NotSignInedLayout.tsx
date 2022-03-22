import { useTheme } from "@emotion/react";
import { Box, Button, Link, Typography } from "@mui/material/";
import { Theme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const NotSignedInLayout = ({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) => {
	const theme: Theme = useTheme();
	const router = useRouter();

	return (
		<Box
			sx={{
				display: "flex",
				height: "100%",
				flexWrap: "wrap",
				justifyContent: "center",
			}}
		>
			<Box
				sx={{
					display: { xs: "none", sm: "flex" },
					width: "50%",
					backgroundColor: "white",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Link href={router.route !== "/" ? "/" : "#"}>
					<Button sx={{ height: 150, display: { xs: "none", sm: "block" } }}>
						<Image
							alt="logo-dark"
							src="/logo-dark-400-200.png"
							height={100}
							width={200}
						/>
					</Button>
				</Link>
			</Box>

			<Box
				sx={{
					display: "flex",
					width: { xs: "100%", sm: "50%" },
					backgroundColor: theme.palette.primary.main,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					p: 1,
				}}
			>
				<Link href={router.route !== "/" ? "/" : "#"}>
					<Button sx={{ height: 150, display: { xs: "block", sm: "none" } }}>
						<Image
							alt="logo-light"
							src="/logo-light.png"
							height={100}
							width={200}
						/>
					</Button>{" "}
				</Link>
				<Typography
					variant="h1"
					sx={{ textAlign: "center", color: "white", m: 1 }}
				>
					{title}
				</Typography>
				{children}
			</Box>
		</Box>
	);
};

export default NotSignedInLayout;
