import React, { useState } from "react";
import Alert from "./components/Alert";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import { Status } from "./types/alertTypes";
import { Parking } from "./types/parkingTypes";
import MyParkingCard from "./components/MyParkingCard";
import './bard.css'


const App: React.FC = () => {
  const [open, setOpen] = useState(false);

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
  }

  return (
    <>
      {/* <button onClick={handleClick}>Mostrar Alerta</button>
      <Alert
        open={open}
        message="¿Está seguro de que desea continuar?"
        handleClose={handleClose}
        confirmation={true}
        type={Status.SUCCESS}
        action={() => {}}
      /> */}
      <MyParkingCard parking={parking} handleReserve={()=>{}}></MyParkingCard>

    </>
  );
};

export default App;
