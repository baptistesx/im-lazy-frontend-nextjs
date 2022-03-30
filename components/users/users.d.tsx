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
