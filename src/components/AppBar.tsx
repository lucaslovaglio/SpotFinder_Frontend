import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useState } from 'react';
import '../styles/login&register.css'
import '../styles/profileButton.css';
import { useAuthProvider } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import ModifyUser from './ModifyUser';


interface Props {
    handleShowSideMenu: () => void
    isOwner: boolean;
}

const MenuAppBar: React.FC<Props> = ({ handleShowSideMenu, isOwner }) => {//   const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [titleState, setTitleState] = useState<boolean>(false); 
    const [showModal, setShowModal] = useState(false);
    const auth = useAuthProvider();
    const navigate = useNavigate();
    const credentials = auth.getCredentials();


//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setAuth(event.target.checked);
//   };

    const handleTitle = () => setTitleState(!titleState);

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


    return (
      <Box sx={{ flexGrow: 1, mt: 0 }}>
        {/* <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={auth}
                onChange={handleChange}
                aria-label="login switch"
              />
            }
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup> */}
          <button className={`HomeTitle ${titleState ? 'show' : ''}`} onClick={handleTitle}>
              <span className="Spot">Spot</span>
              <span className={`Finder ${isOwner ? 'owner' : ''}`}>Finder</span>
          </button>
          <AppBar position="static">
              <div className='NavBar-box'>
                  <IconButton
                      size="small"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2, position: 'absolute',left: '0.5rem'}}
                  >
                      {/* <MenuIcon /> */}
                      <button onClick={handleShowSideMenu} style={{backgroundColor: 'transparent', border: 'none'}}><MenuIcon /></button>
                  </IconButton>
                  <div>
                      <IconButton
                          size="large"
                          aria-label="account of current user"
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                          onClick={handleMenu}
                          color="inherit"
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
                      }}                      >     
                            <button className='Profile-button'>
                              <h1 className='userName'>{credentials.getUserName()}</h1>
                              <h2 className='mail'>{credentials.getUserMail()}</h2>
                            </button>
                            <button className='Profile-button' onClick={() => {handleModalShow(); handleClose();}}>Change Password</button>
                            <button className='Profile-button' onClick={handleLogOutClick}>LogOut</button>
                      </Menu>
                      <ModifyUser show={showModal} handleClose={handleModalClose} credentials={credentials} />
                  </div>
              </div>
          </AppBar>
      </Box>
    );
}   
  
export default MenuAppBar;