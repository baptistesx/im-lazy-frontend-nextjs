import {
	FormBotParams,
	WorkawayFile,
} from "@components/workawayBot/workaway.d";

export type RequestBody = {
	city?: string;
	params?: FormBotParams;
};

export type ApiResponse = {
	files?: WorkawayFile[];
	file?: WorkawayFile;
};
