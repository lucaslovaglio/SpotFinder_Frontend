import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { render } from 'react-dom';
import Credentials from '../services/Credentials';
import '../styles/modifyUser.css'
import axios from 'axios';
import { useAuthProvider } from '../services/auth';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import useUrlProvider from '../services/url';


interface Props {
  show: boolean;
  handleClose: () => void;
  credentials: Credentials;
}

const ModifyUser: React.FC<Props> = ({ show, handleClose, credentials }) => { 
  const url = useUrlProvider();

  const handleSubmit = async () => {
    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (password.length < 1) {
      setPasswordError("Your new password is empty");
      return;
    }
    try {
      const config = {
          headers: {
            Authorization: `Bearer ${credentials.getToken()}` // Token en el header
          },
        };
      const response = await axios.put(url + "users/" + credentials.getUserMail(), {
          "psw": password
        }, config);

      if (response.status === 200) {
        handleOpenAlert(()=>{}, Status.SUCCESS, 'The user information was updated successfully!', false)
      }
    } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }
    handleCloseButtonClick();
  };

  const handleRestart = () => {
    setPassword("")
    setRepeatPassword("")
    setPasswordError("");
  }

  const handleCloseButtonClick = () => {
    handleRestart();
    handleClose();
  }


  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRepeatPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(event.target.value);
    setPasswordError("");
  };


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
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button> */}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className='EditProfile'>
          <div className="form-container">
            {/* <label htmlFor="nameInput">Name:</label>
            <input type="text" id="nameInput" defaultValue={credentials.getUserName()} onChange={(e) => setName(e.target.value)} required/>

            <label htmlFor="mailInput">Mail:</label>
            <input type="email" id="mailInput" defaultValue={credentials.getUserMail()} onChange={(e) => setEmail(e.target.value)} required/>

            <button type="button" onClick={handleSubmit}>Change Password</button> */}
            <label htmlFor="pswInput">New password:</label>
            <input className="LogInput" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label htmlFor="repeatPswInput">Repeat password:</label>
            <input className="LogInput"
              type="password"
              placeholder="Repeat password"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
              required
            />
            {passwordError && <span className="PasswordError">{passwordError}</span>}
          </div>


          {/* <div>
            <span>Name: </span><input type='text' value={credentials.getUserName()}/>
          </div>
          <div>
            <span>Mail:  </span><span>{credentials.getUserMail()}</span>
          </div>
          <div>
            <span>Change password</span>
          </div> */}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseButtonClick}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
      <Alert
            open={openAlert}
            message={alert.message}
            handleClose={handleCloseAlert}
            confirmation={alert.confirmation}
            type={alert.type}
            action={alert.action} />
        
    </>
  );
}

export default ModifyUser;