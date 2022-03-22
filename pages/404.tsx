import SignedInLayout from "@components/layout/SignedInLayout";
import { Button, Typography } from "@mui/material";
import Link from "next/link";

function ResetPassword() {
	return (
		<SignedInLayout>
			<Typography variant="h1">Page not found (Error 404)</Typography>

			<Link href="/" passHref>
				<Button variant="contained">Back to home page</Button>
			</Link>
		</SignedInLayout>
	);
}

export default ResetPassword;
