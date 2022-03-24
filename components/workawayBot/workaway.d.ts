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
