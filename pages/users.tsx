import AdminRoute from "@components/routes/AdminRoute";
import UsersTable from "@components/users/UsersTable";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const Users = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<AdminRoute title={t.users.title}>
			<UsersTable />
		</AdminRoute>
	);
};

export default Users;
