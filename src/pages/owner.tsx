import { useNavigate } from "react-router-dom";
import HeadPage from "../components/HeadPage";

export const OwnerPage = () => {
    const navigate = useNavigate();

    const handleBackToUserClick = () =>  {
        navigate('/homepage')
    }

    return (
        <div className='HomeWrapper'>
            <HeadPage navBar={true}></HeadPage>
            <div className='prueba'>
                {/* <div className='ProfileOptions'>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Your Profile</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Change to Owner</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Change to Manager</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Log Out</button>
                </div> */}
                <div className='sideMenu'>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'>Return to User</h3></button>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'>My Parking Lots</h3></button>
                </div>
                <div className='Map'>
                    <div className='ShowList'>
                        <button className='ShowList-buttom'><h3 className='ShowList-title'>Show List</h3></button>
                    </div>
                </div>
            </div>
        </div>
)}