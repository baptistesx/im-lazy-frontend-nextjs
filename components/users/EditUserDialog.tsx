import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  FormControlLabel,
  TextField,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserById, createUser } from "../../services/userApi";
import useSnackbars from "../../hooks/useSnackbars";
import useUser, { User } from "../../hooks/useUser";
import editUserFormSchema from "../../schemas/editUserFormSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalizeFirstLetter } from "../../utils/functions";

interface EditUserDialogFormData {
  name: string;
  isAdmin: boolean;
  isPremium: boolean;
  email: string;
  password: string;
}

interface EditUserDialogProps {
  keepMounted: boolean;
  open: boolean;
  onClose: Function;
  user?: User | null;
}

function EditUserDialog(props: EditUserDialogProps) {
  const { onClose, open, user, ...other } = props;

  const { user: sessionUser } = useUser();

  const snackbarsService = useSnackbars();

  const [currentUser, setUser] = useState(user);

  // const radioGroupRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditUserDialogFormData>({
    resolver: yupResolver(editUserFormSchema),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!open) {
      setUser(user);
    }
  }, [user, open]);

  const handleEntering = () => {
    // if (radioGroupRef.current != null) {
    //   radioGroupRef.current.focus();
    // }
  };

  const onSubmit = async (data: EditUserDialogFormData) => {
    setIsSaving(true);

    // If updating user
    if (currentUser?.id) {
      updateUserById(
        {
          id: currentUser.id,
          email: data.email,
          isAdmin: data.isAdmin,
          isPremium: data.isPremium,
          name: data.name,
        },
        () => {
          setIsSaving(false);

          onClose({ modified: true });

          snackbarsService?.addAlert({
            message: "User well updated",
            severity: "success",
          });
        }
      ).catch((err: Error) => {
        setIsSaving(false);

        snackbarsService?.addAlert({
          message: "An error occured while updating user",
          severity: "error",
        });
      });
    } else {
      // If creating user
      createUser(
        {
          email: data.email,
          isAdmin: data.isAdmin,
          isPremium: data.isPremium,
          name: data.name,
        },
        () => {
          setIsSaving(false);

          onClose({ modified: true });

          snackbarsService?.addAlert({
            message: "User well created",
            severity: "success",
          });
        }
      ).catch((err: Error) => {
        snackbarsService?.addAlert({
          message: "An error occured while creating user",
          severity: "error",
        });
      });
    }
  };

  return (
    <Dialog
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
      onClose={()=>{onClose({ modified: false });}}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{currentUser?.id ? "Edit" : "Create"} user</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            placeholder="Name"
            {...register("name")}
            sx={{ mb: 1 }}
            defaultValue={capitalizeFirstLetter(currentUser?.name)}
            error={errors.name != null}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            placeholder="Email"
            {...register("email")}
            defaultValue={currentUser?.email}
            error={errors.email != null}
            helperText={errors.email?.message}
          />

          <FormControlLabel
            disabled={
              sessionUser?.isAdmin && currentUser?.id === sessionUser?.id
            }
            control={<Checkbox defaultChecked={currentUser?.isAdmin} />}
            label="Is Admin"
            {...register("isAdmin")}
            value
          />
          <FormControlLabel
            control={<Checkbox defaultChecked={currentUser?.isPremium} />}
            label="Is premium"
            {...register("isPremium")}
            value
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose({ modified: false })}>Cancel</Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSaving}
            sx={{
              m: 1,
            }}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditUserDialog;

EditUserDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
};
