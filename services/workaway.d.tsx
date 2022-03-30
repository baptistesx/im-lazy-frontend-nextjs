import { FormBotParams } from "@components/workawayBot/workaway.d";

export type RequestBody = {
	city?: string;
	params?: FormBotParams;
};

export type ApiResponse = {
	filesName?: string[];
	file?: File;
};
