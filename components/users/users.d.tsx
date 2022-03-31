import { Role, User } from "@providers/user.d";

export type ProfileFormData = {
	email: string;
	name: string;
};

export type EditUserDialogFormData = {
	name: string;
	role: Role;
	email: string;
	password: string;
};

export type EditUserDialogProps = {
	keepMounted: boolean;
	open: boolean;
	onClose: ({ modified }: { modified: boolean }) => Promise<void>;
	user?: User | undefined;
};

export type UsersTableHeader = { file: string; title: string };

export const usersTableHeaders = [
	{ file: "common", title: "name" },
	{ file: "common", title: "email" },
	{ file: "common", title: "role" },
	{ file: "users", title: "email-verified" },
	{ file: "common", title: "actions" },
];
