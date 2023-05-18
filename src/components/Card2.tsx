import { faArrowCircleUp, faArrowsSplitUpAndLeft, faArrowsUpDownLeftRight, faCab } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/card.css'
import { Parking } from '../types/parkingTypes';
import Checkbox from './LikeButton';


interface Props {
  parking: Parking
}


const ParkingCard: React.FC<Props> = ({parking}) => {
  const handleCheckboxChange = (checked: boolean) => {
    console.log('Checkbox checked:', checked);
  };

  return (
    <>
      <div className="card-availableParkings">
        <div className="card-details">
          <div className="title-box">
            <p className="text-title">{parking.name}</p>
            <Checkbox/>
            <button style={{marginLeft: '0rem', border: 'none', backgroundColor: 'transparent', color: 'rgb(0, 206, 225)'}}>
              <FontAwesomeIcon icon={faArrowCircleUp} style={{height: '1.1rem', marginTop: 8}}/>
            </button>
          </div>
          <br />
          <div className='text-box'>
            <p className="text">Attendance:<span className='data'>{parking.attendance} / {parking.capacity}</span></p>
          </div>
          <div className='text-box'>
            <p className="text">Open Hour:<span className='data'>{parking.openhour}</span></p>
          </div>
          <div className='text-box'>
            <p className="text">Close Hour:<span className='data'>{parking.closehour}</span></p>
          </div>
        </div>
        <button className="card-infoButton">More info</button>
      </div>
    </>
  );
};


export default ParkingCard



{/* <div class="card">
  <div class="card-details">
    <p class="text-title">My Parking</p>
    <br/>
    <p class="text-body">Attendance:</p>
    <p class="text-body">Open Hour:</p>
    <p class="text-body">Close Hour:</p>
  </div>
  <button class="card-button">More info</button>
</div>  */}

// .card {
//     width: 190px;
//     height: 254px;
//     border-radius: 20px;
//     background: #f5f5f5;
//     position: relative;
//     padding: 1.8rem;
//     border: 2px solid #c3c6ce;
//     transition: 0.5s ease-out;
//     overflow: visible;
//      width: 190px;
//     height: 254px;
//     border-radius: 30px;
//     background: #212121;
//     box-shadow: 15px 15px 30px rgb(25, 25, 25),
//                 -15px -15px 30px rgb(60, 60, 60);
//    }
   
//    .card-details {
//     color: black;
//     height: 100%;
//     gap: .5em;
//     display: grid;
//     place-content: center;
//    }
   
//    .card-button {
//     transform: translate(-50%, 125%);
//     width: 60%;
//     border-radius: 1rem;
//     border: none;
//     background-color: rgb(0, 255, 149);
//     color: rgb(32, 32, 32);
//     font-size: 1rem;
//     padding: .5rem 1rem;
//     position: absolute;
//     left: 50%;
//     bottom: 0;
//     opacity: 0;
//     transition: 0.3s ease-out;
//    }
   
//    .text-body {
//     color: rgb(134, 134, 134);
//     font-size: 0.8rem
//    }
   
//    /*Text*/
//    .text-title {
//     font-size: 1.25rem;
//     font-weight: bold;
//     color: rgb(0, 255, 149)
//    }
   
//    /*Hover*/
//    .card:hover {
//     border-color: rgb(0, 255, 149);
//     box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
//    }
   
//    .card:hover .card-button {
//     transform: translate(-50%, 50%);
//     opacity: 1;
//    }