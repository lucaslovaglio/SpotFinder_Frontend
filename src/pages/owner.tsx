import { useNavigate } from "react-router-dom";
import HeadPage from "../components/HeadPage";
import SideBarMenu from "../components/SideBarMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import Map from "../components/Map/Map";

export const OwnerPage = () => {
    const navigate = useNavigate();

    const handleBackToUserClick = () =>  {
        navigate('/homepage')
    }

    const coordenadas = [
        { lat: -34.603722, lng: -58.381592 }, // Plaza de Mayo
        { lat: -34.592222, lng: -58.374722 }, // Obelisco
        { lat: -34.602414, lng: -58.383759 }, // Catedral Metropolitana
        { lat: -34.613150, lng: -58.377230 }, // Puerto Madero
      ];
      

    const center = {
        lat: 47.6062095,
        lng: -122.3320708 
    };

    return (
        <div className='HomeWrapper'>
            <HeadPage navBar={true}></HeadPage>
            <div className='content'>
                {/* <div className='ProfileOptions'>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Your Profile</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Change to Owner</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Change to Manager</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Log Out</button>
                </div> */}
                <SideBarMenu>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHouse} style={{ marginRight: '1rem'}}/>My Parking Lots</h3></button>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faAdd} style={{ marginRight: '1rem'}}/>Add Parking Lot</h3></button>
                    <button className="sideMenu-button" onClick={handleBackToUserClick} style={{position: 'absolute', bottom: '0'}}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '1rem'}}/>Return to User</h3></button>
                </SideBarMenu>
                <div className='MapBox'>
                    <Map coordenadas={coordenadas}/>
                </div>
            </div>
        </div>
)}