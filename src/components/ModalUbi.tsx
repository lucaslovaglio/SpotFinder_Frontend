import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MapModal from './MapModal';
import { useState } from 'react';
import '../styles/buttons.css'



interface Props {
    handleCoords: (latitude: any, longitude: any) => void,
    open: boolean
    setOpen: (bool: boolean) => void
}

const AlertDialog: React.FC<Props> = ({handleCoords, open, setOpen}) => {
  // const [open, setOpen] = React.useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMapCoords =(latitude: any, longitude: any) => {
    setLatitude(latitude);
    setLongitude(longitude);
  }

  const handleSubmit = () => {
    handleCoords(latitude, longitude);
    handleClose();
  }


  return (
    <div style={{minHeight: 'fit-content'}}>
      
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{position: 'absolute'}}
      >
        <DialogTitle id="modalUbi-dialog-title">
          {"Mark the location of your parking on the map"}
        </DialogTitle>
        <DialogContent>
          <MapModal handleCoords={handleMapCoords}></MapModal>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;