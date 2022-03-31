export type MemberProfile = {
	name: string;
	age: number;
	profileHref: string;
	from: string;
	idForMessage: string;
	messageSent: boolean;
};

export type FormBotParams = {
	englishMessage: string;
	frenchMessage: string;
	messageSubject: string;
	maximumAge: number;
	minimumAge: number;
	city: string;
	password: string;
	email: string;
	headless: boolean;
	developmentMode: boolean;
	detectionRadius: number;
};

export type File = {
	content: { members: MemberProfile[] } | FormBotParams;
};

export type CitiesFormDialogProps = {
	keepMounted: boolean;
	open: boolean;
	onClose: (city: string | undefined) => Promise<void>;
	value: string | undefined;
	cities: string[] | undefined;
};

export const detectionRadiuses = [5, 10, 20, 50, 100, 250, 500];
