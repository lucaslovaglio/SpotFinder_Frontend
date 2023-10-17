import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import { useEffect, useState } from 'react';
import '../styles/login&register.css'
import '../styles/profileButton.css';
import { useAuthProvider } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import ModifyUser from './ModifyUser';
import CurrentParking from './CurrentParking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCar, faMap, faTrash, faUserGear, faUserTie } from '@fortawesome/free-solid-svg-icons';
import PayMethodDialog from './PayMethod';
import axios from 'axios';
import useUrlProvider from '../services/url';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';


interface Props {
    handleShowSideMenu: () => void
    isOwner: boolean;
}

const MenuAppBar: React.FC<Props> = ({ handleShowSideMenu, isOwner }) => {//   const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [titleState, setTitleState] = useState<boolean>(true); 
    const [showModal, setShowModal] = useState(false);
    const auth = useAuthProvider();
    const navigate = useNavigate();
    const [accordionHeight, setAccordionHeight] = useState(0);
    const [isAccordionHovered, setIsAccordionHovered] = useState(false);
    const [showCurrentParking, setShowCurrentParking] = useState(false);
    const [balance, setBalance] = useState("");
    const [showBalance, setShowBalance] = useState<boolean>(true);

    const url = useUrlProvider();
    const email = auth.getCredentials().getUserMail();
    const name = auth.getCredentials().getUserName();
    const token = auth.getCredentials().getToken();
    




    const handleCurrentParkingHover = () => {
      const windowHeight = window.innerHeight;
      const accordionHeight = (windowHeight / 2) + 100;
      setAccordionHeight(accordionHeight);
      setShowCurrentParking(true)
      setIsAccordionHovered(true);
    };
     
    const handleCurrentParkingLeave = () => {
      if (!isAccordionHovered) {
        setAccordionHeight(0);
        setShowCurrentParking(false)
      }
    };

    useEffect(() => {
        if (!(isAccordionHovered)) {
            setAccordionHeight(0);
            setShowCurrentParking(false)
        }
      }, [isAccordionHovered]);
      
    useEffect(() => {
        if (url === "") {
            return; // Esperar hasta que url tenga un valor diferente de nulo
        }
        fetchBalanceFromDatabase();
      }, [url]);

    
      const fetchBalanceFromDatabase = async () => {
        try {
          const response = await axios.get(url + "balance/" + email);
      
          if (response.status === 200) {
              // handleOpenAlert(()=>{}, Status.SUCCESS, 'Balance added successfully!', false);
              setBalance(response.data.balance)
              console.log(response.data)
          }
        } catch (error) {
              const errorMessage = error ? (error as any).message : '';
              handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false) 
        }
      };
      
    

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setAuth(event.target.checked);
//   };

    const handleTitle = () => {
        setTitleState(titleState);
        navigate('/homepage')
    };

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);


    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogOutClick = () => {
        auth.logOut(navigate);
    };

    const toggleShowBalance = () => {
        setShowBalance((prevShowBalance) => !prevShowBalance);
    };

    const handleDelete = async () => {
        //borrar al user
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}` // Token en el header
                },
                // body: {
                //   mail: email // Nombre de usuario en el body
                // }
              };
            const response = await axios.delete(url + "users/" + email, config);
        
            if (response.status === 200) {
                // succesAlert.setOpen(true)
                handleOpenAlert(()=> auth.logOut(navigate), Status.SUCCESS, `The User ${name} has been deleted`, false)
            }
          } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
        }
    }

    const [refresh, setRefresh] = useState(false)

    const handleMouseInCurrentParking = (display: boolean) => {
        setIsAccordionHovered(display); 
        setShowCurrentParking(display);
        setRefresh(!refresh)
    }

    // // ALERT
    const [openAlert, setOpenAlert] = useState(false);
    const [alert, setAlert] = useState<alertProps>(
        {
            action: () => {},
            type: Status.UNDEFINED,
            message: "",
            confirmation: false, 
        }
    );
    const handleOpenAlert = (action: () => void, type: Status, message: string, confirmation: boolean) => {
        setOpenAlert(true);
        setAlert(
            {
                action: action,
                type: type,
                message: message,
                confirmation: confirmation
            }
        );
    }
    const handleCloseAlert = () => setOpenAlert(false);


    return (
      <div>
          {/* <button className={`HomeTitle ${titleState ? 'show' : ''}`} onClick={handleTitle}>
              <span className="Spot">Spot</span>
              <span className={`Finder ${isOwner ? 'owner' : ''}`}>Finder</span>
          </button> */}
          
            <div className='NavBar-box'>
              {/* <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2, position: 'absolute',left: '0.5rem'}}
              >
                  <button onClick={handleShowSideMenu} style={{backgroundColor: 'transparent', border: 'none'}}><MenuIcon /></button>
              </IconButton> */}
              <div className='LeftColumn-NavBar'>
                <button className={`HomeTitle ${titleState ? 'show' : ''}`} onClick={handleTitle}>
                    <span className="Spot">Spot</span>
                    <span className={`Finder ${isOwner ? 'owner' : ''}`}>Finder</span>
                </button>
                <button 
                    className='CurrentParking-button'
                    onMouseEnter={handleCurrentParkingHover}
                    onMouseLeave={handleCurrentParkingLeave}
                >
                    Current Parking
                </button>
              </div>
              <div className='RightColumn-NavBar'>
                <span className='Balance-field'>
                $ {showBalance ? balance : '***'}
                <IconButton onClick={toggleShowBalance} size="small" sx={{color: "gray"}}>
                  {showBalance ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                </span>
                <div className='User-menu'>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="primary"
                    >
                    <AccountCircle />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                        width: '12rem',
                        },
                    }}                      
                    >     
                            <button className='Profile-button'>
                            <h1 className='userName'>{name}</h1>
                            <h2 className='mail'>{email}</h2>
                            </button>
                            <div style={{width: '100%', height: '0.5px', backgroundColor: 'rgb(215, 215, 215)'}}></div>
                            <button className='Profile-button' onClick={() => {handleModalShow(); handleClose();}}>Change Password</button>
                            <button className='Profile-button' onClick={handleLogOutClick}>LogOut</button>
                            <div style={{width: '100%', height: '0.5px', backgroundColor: 'rgb(215, 215, 215)'}}></div>
                            {!isOwner && (
                            <>
                                <button className='Profile-button' onClick={() => { navigate('/ownerpage') } }>Change to Owner</button>
                                <button className='Profile-button' onClick={() => { navigate('/managerpage') } }>Change to Manager</button>
                            </>
                            )}
                            {isOwner && (
                                <button className='Profile-button' onClick={()=>{ navigate('/homepage') }}>Return to User</button>
                            )}
                            <div style={{width: '100%', height: '0.5px', backgroundColor: 'rgb(215, 215, 215)'}}></div>
                            <PayMethodDialog handleBalance={(amount)=>{setBalance(amount)}}/>
                            <button 
                                className= "Profile-button"
                                onClick={() => 
                                    handleOpenAlert(
                                        handleDelete, 
                                        Status.ALERT, 
                                        'Are you sure you want to delete this user?',
                                        true
                                    )}>
                                    Delete User
                            </button>

                    </Menu>
                    <ModifyUser show={showModal} handleClose={handleModalClose} credentials={auth.getCredentials()} />
                </div>
              </div>
            </div>
                <div 
                    className={`Accordion-container accordionContainer ${showCurrentParking ? 'show' : ''}`}
                    style={{ maxHeight: `${accordionHeight}px` }}
                    // style={{ overflowY: 'hidden', top: '-3rem', height: '1rem' }}
                    onMouseEnter={() => {handleMouseInCurrentParking(true)}}
                    onMouseLeave={() => {handleMouseInCurrentParking(false)}}
                >
                    <div className={`acordion-content ${isAccordionHovered ? 'show' : ''}`}>
                        <CurrentParking needRefresh={refresh}></CurrentParking>
                        {/* <p style={{color: 'white', backgroundColor: 'red'}}>Hola</p>
                        <p style={{color: 'white', backgroundColor: 'red'}}>Hola</p>
                        <p style={{color: 'white', backgroundColor: 'red'}}>Hola</p>
                        <p style={{color: 'white', backgroundColor: 'red'}}>Hola</p>
                        <p style={{color: 'white', backgroundColor: 'red'}}>Hola</p> */}
                    </div>
              </div>
              <Alert
                open={openAlert}
                message={alert.message}
                handleClose={handleCloseAlert}
                confirmation={alert.confirmation}
                type={alert.type}
                action={alert.action} />
      </div>
    );
}   
  
export default MenuAppBar;