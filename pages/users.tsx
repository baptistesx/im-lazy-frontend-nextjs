import AddModeratorIcon from "@mui/icons-material/AddModerator";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveModeratorIcon from "@mui/icons-material/RemoveModerator";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUsers,
  deleteUserById,
  toggleAdminRights,
} from "../services/userApi";
import GlobalLayout from "../components/layout/GlobalLayout";
import EditUserDialog from "../components/users/EditUserDialog";
import useUser, { User } from "../hooks/useUser";
import useSnackbars from "../hooks/useSnackbars";
import { useRouter } from "next/router";
import api from "../services/api";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await api
      .axiosApiCall("user", "get", {}, ctx.req.headers.cookie)
      .then((res) => res.data);
    return { props: { user } };
  } catch (err: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

function Users({ user }: { user: User }) {
  const snackbarsService = useSnackbars();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<User[]>([]);

  const [isEditUserDialogOpen, setIsEditUserDialogOpen] =
    useState<boolean>(false);

  const [userSelected, setUserSelected] = useState<User | null>();

  const currentUser = user;

  useEffect(() => {
    fetchData();
  }, []);

  const onRefreshClick = () => {
    fetchData();
  };

  const fetchData = () => {
    setIsLoading(true);

    getUsers((users: User[]) => {
      setUsers([...users]);

      // Sort users on name property
      users.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

      setIsLoading(false);
    }).catch((err: Error) => {
      snackbarsService?.addAlert({
        message: "An error occured while getting users",
        severity: "error",
      });
    });
  };

  const handleDelete = async (userId: string) => {
    setIsLoading(true);

    deleteUserById(userId, () => {
      fetchData();

      setIsLoading(false);

      snackbarsService?.addAlert({
        message: "User well deleted",
        severity: "success",
      });
    }).catch((err: Error) => {
      snackbarsService?.addAlert({
        message: "An error occured while deleting user",
        severity: "error",
      });
    });
  };

  const handleToggleAdminRights = async (userId: string) => {
    setIsLoading(true);

    toggleAdminRights(userId, () => {
      fetchData();

      setIsLoading(false);

      snackbarsService?.addAlert({
        message: "User well updated",
        severity: "success",
      });
    }).catch((err: Error) => {
      snackbarsService?.addAlert({
        message: "An error occured while toggling user admin rights",
        severity: "error",
      });
    });
  };

  const handleOpenUserDialog = (userToEdit?: User) => {
    setUserSelected(userToEdit ?? null);

    setIsEditUserDialogOpen(true);
  };

  const handleCloseUserDialog = async (res: { modified: boolean }) => {
    setIsEditUserDialogOpen(false);
    setUserSelected(null);

    if (res?.modified) {
      fetchData();
    }
  };

  return (
    <GlobalLayout user={user}>
      <Typography variant="h1">Users</Typography>

      <Card>
        <CardContent>
          {users.length === 0 && isLoading ? (
            <Box />
          ) : (
            <Box>
              <Typography variant="body1">
                {`${users.length} Available users`}
              </Typography>

              {users.length === 0 ? (
                <Typography>No users</Typography>
              ) : (
                //TODO: extract compoennt
                <TableContainer component={Paper}>
                  <Table aria-label="users table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Email</TableCell>
                        <TableCell align="left">Admin</TableCell>
                        <TableCell align="left">Premium</TableCell>
                        <TableCell align="left">Email verified</TableCell>
                        <TableCell align="left">Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user?.id}>
                          <TableCell component="th" scope="row">
                            {user?.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {user?.email}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {user?.isAdmin ? <CheckIcon /> : <ClearIcon />}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {user?.isPremium ? <CheckIcon /> : <ClearIcon />}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {user?.isEmailVerified ? (
                              <CheckIcon />
                            ) : (
                              <ClearIcon />
                            )}
                          </TableCell>
                          <TableCell align="left">
                            <Tooltip title="Toggle admin rights">
                              <IconButton
                                aria-label="toggle-admin-rights"
                                onClick={() => handleToggleAdminRights(user.id)}
                                disabled={
                                  user.email === currentUser?.email || isLoading
                                }
                              >
                                {user.isAdmin ? (
                                  <RemoveModeratorIcon />
                                ) : (
                                  <AddModeratorIcon />
                                )}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit user">
                              <IconButton
                                onClick={() => handleOpenUserDialog(user)}
                                disabled={isLoading}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete user">
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(user.id)}
                                disabled={
                                  user.email === currentUser?.email || isLoading
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button variant="contained" onClick={() => handleOpenUserDialog()}>
            Create a user
          </Button>

          <LoadingButton
            loading={isLoading}
            onClick={onRefreshClick}
            sx={{
              m: 1,
            }}
          >
            Refresh
          </LoadingButton>
        </CardActions>
      </Card>

      {userSelected || isEditUserDialogOpen ? (
        <EditUserDialog
          keepMounted
          open={isEditUserDialogOpen}
          onClose={handleCloseUserDialog}
          user={userSelected}
        />
      ) : (
        <Box></Box>
      )}
    </GlobalLayout>
  );
}

export default Users;
