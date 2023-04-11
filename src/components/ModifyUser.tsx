import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { render } from 'react-dom';


interface Props {
  show: boolean;
  handleClose: () => void;
}

const ModifyUser: React.FC<Props> = ({ show, handleClose }) => { 
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
          <div>
            <span>Name</span><span>Lucas</span>
          </div>
          <div>
            <span>Mail</span><span>luckylovaglio@gmail</span>
          </div>
          <div>
            <span>Change password</span>
          </div>

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