export type Role = "admin" | "premium" | "classic";

export type User = {
	id: string;
	name: string;
	email: string;
	role: Role;
	isEmailVerified: boolean;
	lastLogin: Date;
};

type Connected = {
	user: User;
	status: "connected";
};

type Loading = {
	user: User | undefined;
	status: "loading";
};

type NotConnected = {
	user: undefined;
	status: "not-connected";
};

export type AuthValue = {
	value: Connected | NotConnected | Loading;
	setValue: (value: Connected | NotConnected | Loading) => void;
	isAdmin: (user: User | undefined) => boolean;
	isPremium: (user: User | undefined) => boolean;
};

export type AuthActionsValue = {
	logout: () => void;
	login: (email: string, password: string, cb: () => void) => void;
	register: (
		name: string,
		email: string,
		password: string,
		cb: () => void
	) => void;
	loginWithGoogle: (token: string, cb: () => void) => void;
	fetchCurrentUser: () => void;
};

export type PaymentResume = {
	createTime: string | undefined;
	updateTime: string | undefined;
	payer: {
		email: string | undefined;
		name: string | undefined;
		surname: string | undefined;
		id: string | undefined;
		address: Address | undefined;
	};
	amount: string | undefined;
	currency: string | undefined;
	status:
		| "COMPLETED"
		| "SAVED"
		| "APPROVED"
		| "VOIDED"
		| "PAYER_ACTION_REQUIRED"
		| undefined;
	merchandEmail: string | undefined;
	merchandId: string | undefined;
	billingToken?: string | null | undefined;
	facilitatorAccessToken: string;
	orderID: string;
	payerID?: string | null | undefined;
	paymentID?: string | null | undefined;
	subscriptionID?: string | null | undefined;
	authCode?: string | null | undefined;
};
