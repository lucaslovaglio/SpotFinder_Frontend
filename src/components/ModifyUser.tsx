import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { render } from 'react-dom';
import Credentials from '../services/Credentials';
import '../pages/styles/modifyUser.css'
import axios from 'axios';


interface Props {
  show: boolean;
  handleClose: () => void;
  credentials: Credentials;
}

const ModifyUser: React.FC<Props> = ({ show, handleClose, credentials }) => { 
  const [name, setName] = useState(credentials.getUserName());
  const [email, setEmail] = useState(credentials.getUserMail());

  const handleSubmit = async () => {
    alert(`name: ${name} mail: ${email}`)

    //TODO en el back creo que solo se puede cambiar la psw, checkear como cambiar el resto

    // try {
    //   alert('1')
    //   const config = {
    //       headers: {
    //         Authorization: `Bearer ${token}` // Token en el header
    //       },
    //     };
    //   const response = await axios.put("http://localhost:3001/users/" + email, config);
  
    //   if (response.status === 200) {
    //     alert('The user information was updated successfully!')
    //   }
    // } catch (error) {
    //   alert(error);
    // }
  };

  const handleRestart = () => {
    setName(credentials.getUserName());
    setEmail(credentials.getUserMail());
  }

  const handleCloseButtonClick = () => {
    handleRestart();
    handleClose();
  }

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
            <input type="text" id="nameInput" defaultValue={credentials.getUserName()} onChange={(e) => setName(e.target.value)} required/>

            <label htmlFor="mailInput">Mail:</label>
            <input type="email" id="mailInput" defaultValue={credentials.getUserMail()} onChange={(e) => setEmail(e.target.value)} required/>

            <button type="button" onClick={handleSubmit}>Change Password</button>
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
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModifyUser;