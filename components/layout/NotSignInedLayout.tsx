import { Box, Button, Typography } from "@mui/material/";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";

const NotSignedInLayout = ({
	children,
	title,
}: {
	children: ReactNode;
	title?: string;
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
					backgroundColor: "white",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Link href="/" passHref>
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
