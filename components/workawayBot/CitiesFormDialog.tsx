import {
  Button,
  Dialog,
  DialogActions,
  FormControlLabel,
  Radio,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import RadioGroup from "@mui/material/RadioGroup";
import PropTypes from "prop-types";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface CitiesFormDialogProps {
  keepMounted: boolean;
  open: boolean;
  onClose: Function;
  value: string;
  cities: string[];
}

function CitiesFormDialog(props: CitiesFormDialogProps) {
  const { onClose, value: valueProp, open, cities, ...other } = props;

  const [value, setValue] = useState(valueProp);

  const radioGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleSubmit = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Full city/country name</DialogTitle>

      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="city"
          name="city"
          value={value}
          onChange={handleChange}
        >
          {cities.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

CitiesFormDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default CitiesFormDialog;
