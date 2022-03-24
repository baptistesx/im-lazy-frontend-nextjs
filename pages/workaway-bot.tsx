import PremiumRoute from "@components/routes/PremiumRoute";
import BotLogs from "@components/workawayBot/BotLogs";
import FilesSection from "@components/workawayBot/FilesSection";
import InfoForm from "@components/workawayBot/InfoForm";
import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const WorkawayBot = (): ReactElement => {
	const { t } = useTranslation("workaway-bot");

	return (
		<PremiumRoute title={t("title")}>
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
				}}
			>
				<InfoForm />

				<BotLogs />
			</Box>

			<FilesSection />
		</PremiumRoute>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "workaway-bot"])),
		},
	};
};

export default WorkawayBot;
