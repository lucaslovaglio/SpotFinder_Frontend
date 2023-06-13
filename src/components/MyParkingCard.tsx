import { faArrowCircleUp, faInfo, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/parkingCard.css'
import { Parking } from '../types/parkingTypes';
import Checkbox from './LikeButton';
import ParkingInfoModal from './ParkingInfoModal';
import { useState } from 'react';


interface Props {
  parking: Parking
  handleReserve: () => void
}


const MyParkingCard: React.FC<Props> = ({parking, handleReserve}) => {
  const handleCheckboxChange = (checked: boolean) => {
    console.log('Checkbox checked:', checked);
  };

  let color = ''
  const status = parking.attendance/parseInt(parking.capacity)
  if (status <= 0.7) color = '#00A862';
  else if (status <= 0.95) color = '#F2C335';
  else color = '#A60F0F';

  const [showParkingInfo, setShowParkingInfo] = useState<boolean>(false)
  
  
  
  

  return (
    <>
      <div className="card-myParkingLots">
        <div className="card-details-owner">
          <div className="title-box-owner">
            <p className="text-title-owner">{parking.name}</p>
            <div className='buttons-box-owner'></div>
            <button className='buttons-header-owner' style={{backgroundColor: 'rgb(0, 206, 225)'}} onClick={handleReserve}>
              <FontAwesomeIcon icon={faInfo} style={{height: '.7rem', marginBottom: 8, color: '#030a18'}}/>
            </button>
            <button className='buttons-header-owner' style={{backgroundColor: 'rgb(0, 255, 149)'}} onClick={handleReserve}>
              <FontAwesomeIcon icon={faPencil} style={{height: '.7rem', marginBottom: 8, color: '#030a18'}}/>
            </button>
            <button className='buttons-header-owner' style={{backgroundColor: 'red'}} onClick={handleReserve}>
              <FontAwesomeIcon icon={faTrash} style={{height: '.7rem', marginBottom: 8}}/>
            </button>
          </div>
          <div className='card-columns'>
            <div className='card-leftColumn'>
              <div className='text-box-owner'>
                <p className="text-owner">Address:<span className='data-owner'>avenida cabildo 5266</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Attendance:<span className='data-owner'>{parking.openhour.substring(0, parking.openhour.length-3)}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Phone:<span className='data-owner'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
            </div>
            <div className='card-rightColumn'>
              <div className='text-box-owner'>
                <p className="text-owner">Open Hour:<span className='data-owner'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Close Hour:<span className='data-owner'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Price:<span className='data-owner'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
            </div>
          </div>
          <button className="card-statusButton" onClick={() => setShowParkingInfo(true)}>Check status</button>
        </div>
        <ParkingInfoModal open={showParkingInfo} parking={parking} handleClose={() => setShowParkingInfo(false)}></ParkingInfoModal>
      </div>
    </>
  );
};


export default MyParkingCard