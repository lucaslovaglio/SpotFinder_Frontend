import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/parkingCard.css'
import { Parking } from '../types/parkingTypes';
import Checkbox from './LikeButton';
import ParkingInfoModal from './ParkingInfoModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface Props {
  parking: Parking
  handleReserve: () => void
}


const ParkingCard: React.FC<Props> = ({parking, handleReserve}) => {
  const handleCheckboxChange = (checked: boolean) => {
    console.log('Checkbox checked:', checked);
  };

  let color = ''
  const status = parking.attendance/parseInt(parking.capacity)
  if (status <= 0.7) color = '#00A862';
  else if (status <= 0.95) color = '#F2C335';
  else color = '#A60F0F';

  const [showParkingInfo, setShowParkingInfo] = useState<boolean>(false)
  const navigate = useNavigate();

  
  const handleParkingDetails = () => {navigate('/homepage/parking/' + parking.id)}
  

  return (
    <>
      <div className="card-availableParkings">
        <div className='parkingState' style={{backgroundColor: color}}/>
        <div className="card-details">
          <div className="title-box">
            <p className="text-title">{parking.name}</p>
            <Checkbox/>
            <button style={{marginLeft: '0rem', border: 'none', backgroundColor: 'transparent', color: 'rgb(0, 206, 225)'}} onClick={handleReserve}>
              <FontAwesomeIcon icon={faArrowCircleUp} style={{height: '1.1rem', marginTop: 8}}/>
            </button>
          </div>
          <br />
          <div className='text-box'>
            <p className="text">Attendance:<span className='data'>{parking.attendance} / {parking.capacity}</span></p>
          </div>
          <div className='text-box'>
            <p className="text">Open Hour:<span className='data'>{parking.openhour.substring(0, parking.openhour.length-3)}</span></p>
          </div>
          <div className='text-box'>
            <p className="text">Close Hour:<span className='data'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
          </div>
        </div>
        <button className="card-infoButton" onClick={handleParkingDetails}>More info</button>
        {/* <ParkingInfoModal open={showParkingInfo} parking={parking} handleClose={() => setShowParkingInfo(false)}></ParkingInfoModal> */}
      </div>
    </>
  );
};


export default ParkingCard