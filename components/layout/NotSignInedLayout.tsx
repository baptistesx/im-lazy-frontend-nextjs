import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import { Box, Button, Typography, useTheme } from "@mui/material/";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";

const NotSignedInLayout = ({
	children,
	title,
	isOffline,
}: {
	children?: ReactNode;
	title?: string;
	isOffline?: boolean;
}): ReactElement => {
	const theme = useTheme();

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
					backgroundColor:
						theme.palette.mode === "dark"
							? theme.palette.primary.dark
							: theme.palette.primary.main,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Link href="/" passHref>
					<Button sx={{ height: 150, display: { xs: "none", sm: "block" } }}>
						<Image
							alt="logo"
							src={
								theme.palette.mode === "dark"
									? "/logo-dark.png"
									: "/logo-light.png"
							}
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
					backgroundColor:
						theme.palette.mode === "dark"
							? theme.palette.background.default
							: "background.primary",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					p: 1,
				}}
			>
				<Link href="/" passHref>
					<Button sx={{ height: 150, display: { xs: "block", sm: "none" } }}>
						<Image
							alt="logo-light"
							src="/logo-light.png"
							height={100}
							width={200}
						/>
					</Button>
				</Link>

				<Typography
					variant="h1"
					sx={{ textAlign: "center", color: "text.primary", m: 1 }}
				>
					{title}
				</Typography>

				{isOffline ? (
					<SignalWifiOffIcon
						sx={{ width: 100, height: 100, color: "text.primary" }}
					/>
				) : (
					children
				)}
			</Box>
		</Box>
	);
};

export default NotSignedInLayout;
