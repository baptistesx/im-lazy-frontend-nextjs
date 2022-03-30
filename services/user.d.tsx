import { PaymentResume, User } from "@providers/user.d";

export type RequestBody = {
	id?: string;
	name?: string;
	email?: string;
	newPassword?: string;
	currentPassword?: string;
	role?: string;
	paymentResume?: PaymentResume;
};

export type ApiResponse = {
	users?: User[];
};
