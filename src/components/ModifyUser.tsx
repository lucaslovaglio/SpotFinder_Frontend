import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { render } from 'react-dom';
import Credentials from '../services/Credentials';
import '../pages/styles/modifyUser.css'


interface Props {
  show: boolean;
  handleClose: () => void;
  credentials: Credentials;
}

const ModifyUser: React.FC<Props> = ({ show, handleClose, credentials }) => { 
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
          {/* TODO: Darle estilo y modificar los datos realmente en la db, para esto tiene que estar bien implementado el token */}

          <div className="form-container">
            <label htmlFor="nameInput">Name:</label>
            <input type="text" id="nameInput" defaultValue={credentials.getUserName()} required/>

            <label htmlFor="mailInput">Mail:</label>
            <input type="email" id="mailInput" defaultValue={credentials.getUserMail()} required/>

            <button type="button">Change Password</button>
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModifyUser;