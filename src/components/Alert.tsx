import React, { MouseEventHandler } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ThemeProvider,
} from "@mui/material";
import { Warning as AlertIcon } from "@mui/icons-material";
import { CheckCircle as SuccesIcon } from "@mui/icons-material";
import { Error as ErrorIcon } from "@mui/icons-material";
import theme from "../styles/theme";
import { Status } from "../types/alertTypes";

interface AlertProps {
  open: boolean;
  message: string;
  handleClose: () => void;
  confirmation: boolean;
  type: Status;
  action: () => void;
}

const Alert: React.FC<AlertProps> = ({ open, message, handleClose, confirmation, type, action }) => {
  const handleBackdropClick: MouseEventHandler<HTMLElement> = (event) => {
    handleClose();
  };

  const handleDialogClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === "backdropClick") {
      event.stopPropagation();
    } else {
      handleClose();
    }
  };

  let icon: React.ReactNode

  switch (type) {
    case Status.SUCCESS:
      icon = <SuccesIcon sx={{ color: "success.main", mr: 1, mb: 0.7 }} />;
      break;
    case Status.ALERT:
      icon = <AlertIcon sx={{ color: "warning.main", mr: 1, mb: 0.7 }}/>
      break;
    case Status.ERROR:
      icon = <ErrorIcon sx={{ color: "error.main", mr: 1, mb: 0.7 }} />;
      break;
    default:
      icon = null;
      break;
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        BackdropProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.3)",
            cursor: "default",

          },
          onClick: handleBackdropClick,
        }}
        sx={{position: 'absolute', top:'-70vh', border: 'none'}}
      >
        <DialogTitle sx={{bgcolor: "secondary.main", color: "white"}}>
          {icon}
          Alerta
        </DialogTitle>
        <DialogContent sx={{bgcolor: "secondary.main", minWidth: '50vh' }}>
          <DialogContentText color='grey'>{message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "secondary.main" }}>
          {confirmation && (<Button onClick={handleClose} color="primary">
            Cancelar
          </Button>)}
          <Button
            onClick={() => {action(); handleClose();}}
            color="primary"
            variant="contained"
            autoFocus
          >
            {confirmation ? "Confirmar" : "Aceptar"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Alert;