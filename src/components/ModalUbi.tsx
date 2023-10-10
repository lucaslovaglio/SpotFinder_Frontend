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
}

const ModalUbi: React.FC<Props> = ({handleCoords}) => {

  return (
    <div style={{height: '100%',position: 'relative', }}>
      
          {"Mark the location of your parking on the map"}

          <MapModal handleCoords={handleCoords}></MapModal>

    </div>
  );
}

export default ModalUbi;