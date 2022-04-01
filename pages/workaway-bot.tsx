import PremiumRoute from "@components/routes/PremiumRoute";
import BotLogs from "@components/workawayBot/BotLogs";
import EnhancedTable from "@components/workawayBot/EnhancedTable";
import InfoForm from "@components/workawayBot/InfoForm";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const WorkawayBot = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<PremiumRoute title={t.workawayBot.title}>
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
				}}
			>
				<InfoForm />

				<BotLogs />

				<EnhancedTable />
			</Box>
		</PremiumRoute>
	);
};

export default WorkawayBot;
