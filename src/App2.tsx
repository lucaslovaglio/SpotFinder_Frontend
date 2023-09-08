import React, { useState } from "react";
import Alert from "./components/Alert";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import { Status } from "./types/alertTypes";
import { Parking } from "./types/parkingTypes";
import MyParkingCard from "./components/MyParkingCard";
import { Button } from "react-bootstrap";
import PayMethodDialog from "./components/PayMethod";
import MapModal from "./components/MapModal";
import ModalUbi from "./components/ModalUbi";


const App: React.FC = () => {
  // const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const parking: Parking = {
    id: '1234',
    longitude: -33,
    latitude: -54,
    name: 'My Parking', 
    capacity: '50',
    openhour: '18:00:00',
    closehour: '20:00:00',
    phone: '1122558877',
    rating: '5',
    attendance: 10,
    address: "",
    pricexminute: 10,
  }

  const [payMethodOpen, setPayMethodOpen] = useState<boolean>(false);
  
  const handleOpenPayMethod = () => {
    setPayMethodOpen(true);
  };
  
  const handleClosePayMethod = () => {
    setPayMethodOpen(false);
  };
  
  
      //ModalMap
      const [latitude, setLatitude] = useState();
      const [longitude, setLongitude] = useState();
      const [open, setOpen] = React.useState(false);
    
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleCoords = (latitude: any, longitude: any) => {
        console.log('sisisi')
        setLatitude(latitude);
        setLongitude(longitude);
      }

  return (
    <div className="MapBox">
      {/* <button onClick={handleClick}>Mostrar Alerta</button>
      <Alert
        open={open}
        message="¿Está seguro de que desea continuar?"
        handleClose={handleClose}
        confirmation={true}
        type={Status.SUCCESS}
        action={() => {}}
      /> */}
      <div>
      <button type="button" className='ModalMap-button' onClick={handleClickOpen}>
              Click here to mark the location on the map
            </button>
      <ModalUbi handleCoords={handleCoords} open={open} setOpen={setOpen}></ModalUbi>
      <p>{latitude}, {longitude}</p>
      </div>

    </div>
  );
};

export default App;
