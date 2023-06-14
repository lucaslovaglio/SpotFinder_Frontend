import { useState } from "react";
import { Parking } from "../types/parkingTypes";
import axios from "axios";
import "../styles/currentParking.css"
import QRToast from "./QrToast";
import QRCode from "react-qr-code";


interface Props {
    
  }


const CurrentParking: React.FC<Props> = () => {
    const [currentParking, setCurrentParking] = useState<Parking>(
        {
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
    );
    const [token, setToken] = useState(".bgjkbgjabasdgdfiodjfhjsdfshdfjkhsjkl");
    const [timeOfEntrance, setTimeOfEntrance] = useState("12:30");

    const getCurrentParking = async () => {
        try {
        //     const response = await axios.post("http://localhost:3001/users/" + email, {
        //       "psw": password
        //     });
            
        //     if (response.status === 200) {
        //       auth.addCredenials(response.data.token, response.data.userName, response.data.userMail);
        //       navigate("/homepage");
        //     }
          } catch (error) {
            alert(error);
        }
    };

    return(
    <>
    <div className="current-parking">
      <div className="parking-header">
        <h1 className="parking-title">{currentParking.name}</h1>
      </div>
      <div className="parking-details">
        <p>
          <strong>ID:</strong> {currentParking.id}
        </p>
        <p>
          <strong>Longitude:</strong> {currentParking.longitude}
        </p>
        <p>
          <strong>Latitude:</strong> {currentParking.latitude}
        </p>
        <p>
          <strong>Capacity:</strong> {currentParking.capacity}
        </p>
        <p>
          <strong>Open Hour:</strong> {currentParking.openhour}
        </p>
        <p>
          <strong>Close Hour:</strong> {currentParking.closehour}
        </p>
        <p>
          <strong>Phone:</strong> {currentParking.phone}
        </p>
        <p>
          <strong>Rating:</strong> {currentParking.rating}
        </p>
        <p>
          <strong>Attendance:</strong> {currentParking.attendance}
        </p>
        <div className="qr-current-parking">
            <QRCode value={token} />
        </div>
      </div>
    </div>
    </>
    );
}

export default CurrentParking;