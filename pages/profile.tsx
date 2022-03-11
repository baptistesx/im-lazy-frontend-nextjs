import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import GlobalLayout from "../components/layout/GlobalLayout";
import { updateUserById } from "../services/userApi";
import useSnackbars from "../hooks/useSnackbars";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import editProfileFormSchema from "../schemas/editProfileFormSchema";
import { capitalizeFirstLetter } from "../utils/functions";

type ProfileSubmitFormData = {
  email: string;
  name: string;
};

function Profile() {
  const router = useRouter();

  const snackbarsService = useSnackbars();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<ProfileSubmitFormData>({
    resolver: yupResolver(editProfileFormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const { user, loading, loggedIn } = useUser();

  useEffect(() => {
    if (!loggedIn && !loading) {
      router.push("/");
    }
  }, [loggedIn]);

  const handleSave = async (data: ProfileSubmitFormData) => {
    setIsLoading(true);

    updateUserById(
      {
        id: user?.id,
        email: data.email,
        isAdmin: user?.isAdmin, //TODO security issue => pass this param optional
        isPremium: user?.isPremium, //TODO security issue => pass this param optional
        name: data.name,
      },
      () => {
        setIsLoading(false);

        snackbarsService?.addAlert({
          message: "User well updated",
          severity: "success",
        });

        reset(data);
      }
    );
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <GlobalLayout>
      {loading || !loggedIn ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h1">Profile</Typography>

          <Card
            component="form"
            variant="outlined"
            onSubmit={handleSubmit(handleSave)}
          >
            <CardContent>
              <TextField
                fullWidth
                placeholder="Name"
                {...register("name")}
                sx={{ mb: 1 }}
                defaultValue={capitalizeFirstLetter(user?.name)}
                error={errors.name != null}
                helperText={errors.name?.message}
              />

              <TextField
                fullWidth
                placeholder="Email"
                {...register("email")}
                sx={{ mb: 1 }}
                defaultValue={user?.email}
                error={errors.email != null}
                helperText={errors.email?.message}
              />
              {/* //TODO: add feature to change password */}
              {!user?.isPremium ? (
                <Button
                  onClick={() => handleNavigate("/get-licence")}
                  variant="contained"
                  sx={{ m: 1 }}
                >
                  Get Premium Account to access bots !
                </Button>
              ) : (
                <Box />
              )}
            </CardContent>

            <CardActions>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isDirty}
                loading={isLoading}
                sx={{
                  m: 1,
                }}
              >
                Save
              </LoadingButton>
            </CardActions>
          </Card>
        </>
      )}
    </GlobalLayout>
  );
}

export default Profile;
