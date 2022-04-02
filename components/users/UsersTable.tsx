import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";
import { User } from "./EditUserDialog";

type UsersTableHeader = { file: string; title: string };

const usersTableHeaders = [
	{ file: "common", title: "name" },
	{ file: "common", title: "email" },
	{ file: "common", title: "role" },
	{ file: "users", title: "email-verified" },
	{ file: "common", title: "actions" },
];

const UsersTable = ({
	users,
	isLoading,
	handleOpenUserDialog,
	handleDelete,
}: {
	users: User[];
	isLoading: boolean;
	handleOpenUserDialog: (userToEdit?: User | undefined) => void;
	handleDelete: (userId: string) => Promise<void>;
}): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();

	const currentUser = auth?.value.user;

	return (
		<TableContainer component={Paper}>
			<Table aria-label="users table">
				<TableHead>
					<TableRow>
						{usersTableHeaders.map((header: UsersTableHeader) => {
							const translation = JSON.parse(JSON.stringify(t));

							return (
								<TableCell align="left" key={header.title}>
									{translation[header.file][header.title]}
								</TableCell>
							);
						})}
					</TableRow>
				</TableHead>

				<TableBody>
					{users?.map((user) => (
						<TableRow key={user?.id}>
							<TableCell component="th" scope="row">
								{user?.name}
							</TableCell>

							<TableCell component="th" scope="row">
								{user?.email}
							</TableCell>

							<TableCell component="th" scope="row">
								{user?.role}
							</TableCell>

							<TableCell component="th" scope="row">
								{user?.isEmailVerified ? <CheckIcon /> : <ClearIcon />}
							</TableCell>

							<TableCell>
								<Tooltip title={t.users["edit-user"]}>
									<span>
										<IconButton
											onClick={(): void => handleOpenUserDialog(user)}
											disabled={isLoading}
										>
											<EditIcon />
										</IconButton>
									</span>
								</Tooltip>

								<Tooltip title={t.users["delete-user"]}>
									<span>
										<IconButton
											aria-label="delete"
											onClick={(): Promise<void> => handleDelete(user.id)}
											disabled={user.email === currentUser?.email || isLoading}
										>
											<DeleteIcon />
										</IconButton>
									</span>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UsersTable;
