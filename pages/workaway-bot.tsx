import PremiumRoute from "@components/routes/PremiumRoute";
import BotLogs from "@components/workawayBot/BotLogs";
import FilesTable from "@components/workawayBot/FilesTable";
import InfoForm from "@components/workawayBot/InfoForm";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";

const WorkawayBot = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const [isStarting, setIsStarting] = useState<boolean>(false);
	const [isStopping, setIsStopping] = useState<boolean>(false);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	return (
		<PremiumRoute title={t.workawayBot.title}>
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					gap: "20px",
				}}
			>
				<InfoForm
					isStarting={isStarting}
					setIsStarting={setIsStarting}
					isStopping={isStopping}
					setIsStopping={setIsStopping}
					isRunning={isRunning}
					setIsRunning={setIsRunning}
				/>

				<BotLogs setIsRunning={setIsRunning} />

				<FilesTable />
			</Box>
		</PremiumRoute>
	);
};

export default WorkawayBot;
