import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import GlobalLayout from "../components/layout/GlobalLayout";
import { getUser, updateUserById } from "../services/userApi";
import useSnackbars from "../hooks/useSnackbars";
import useUser, { User } from "../hooks/useUser";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import editProfileFormSchema from "../schemas/editProfileFormSchema";
import { capitalizeFirstLetter } from "../utils/functions";
import Link from "next/link";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await getUser(ctx.req.headers.cookie);
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

type ProfileSubmitFormData = {
  email: string;
  name: string;
};

function Profile({ user }: { user: User }) {
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

  return (
    <GlobalLayout user={user}>
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
            <Link href="/get-licence">
              <Button variant="contained" sx={{ m: 1 }}>
                Get Premium Account to access bots !
              </Button>
            </Link>
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
    </GlobalLayout>
  );
}

export default Profile;
