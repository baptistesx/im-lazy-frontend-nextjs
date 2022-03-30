import { User } from "@providers/user.d";

export type AuthBody = {
	name?: string;
	email?: string;
	password?: string;
	access_token?: string;
};

export type AuthResponse = {
	user: User;
};
