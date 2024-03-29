import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuthProvider } from '../services/auth';
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/buttons.css'
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import useUrlProvider from '../services/url';
import ModalUbi from './ModalUbi';


interface Props {
  handleRefresh: () => void,
}

const AddParkingButton: React.FC<Props> = ({handleRefresh}) => {
  const credentials = useAuthProvider().getCredentials();
  const url = useUrlProvider();
  const [showModal, setShowModal] = useState(false);
  const [parkingInfo, setParkingInfo] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    capacity: '',
    openHour: '',
    closeHour: '',
    phone: '',
    pricexminute: 0,
  });

  const handleClose = () => {
    setParkingInfo({
      name: '',
      latitude: 0,
      longitude: 0,
      capacity: '',
      openHour: '',
      closeHour: '',
      phone: '',
      pricexminute: 0,
    });
    setShowModal(false);
    setShowMapModal(false);
    handleRefresh();
  };
  
  const handleShow = () => setShowModal(true);

  const handleInputChange = (event: { target: { id: any; value: any; }; }) => {
    const { id, value } = event.target;
    setParkingInfo({ ...parkingInfo, [id]: value });
  };

  const handleAdd = async () => {
    // Lógica para agregar el parking con la información ingresada
    // Puedes acceder a los valores de los campos de entrada de información utilizando el estado parkingInfo

    try {
      const data = {
            "name": parkingInfo.name,
            "lat": parkingInfo.latitude,
            "lon": parkingInfo.longitude,
            "capacity": parkingInfo.capacity,
            "ownerMail": credentials.getUserMail(),
            "openHour": parkingInfo.openHour,
            "closeHour": parkingInfo.closeHour,
            "phone": parkingInfo.phone,
            "pricexminute": parkingInfo.pricexminute,
        };
      const response = await axios.post(url + "parkings/", data);
  
      if (response.status === 200) {
          handleOpenAlert(()=>{}, Status.SUCCESS, 'Parking added successfully!', false);
      }
    } catch (error) {
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }

    handleClose();
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

  //ModalMap
  const [showMapModal, setShowMapModal] = React.useState(false);

  const handleClickOpen = () => {
    setShowMapModal(true);
  };

  const handleCoords = (latitude: any, longitude: any) => {
    setParkingInfo({ ...parkingInfo, ['latitude']: latitude, ['longitude']: longitude });
  }
  

  return (
    <>
      <button className='spotFinder-button' onClick={handleShow}><FontAwesomeIcon icon={faAdd}/></button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Parking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={parkingInfo.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            {showMapModal ? (
              <Form.Group controlId='ubication'>
                <Form.Label>Ubication</Form.Label>
                <div style={{position: 'relative', overflow: 'hidden'}}>
                  <ModalUbi handleCoords={handleCoords}></ModalUbi>
                </div>
              </Form.Group>
            ): (
              <><Form.Group controlId="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter latitude"
                    value={parkingInfo.latitude}
                    onChange={handleInputChange} />
                </Form.Group><Form.Group controlId="longitude">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter longitude"
                      value={parkingInfo.longitude}
                      onChange={handleInputChange} />
                  </Form.Group><div>
                    <button type="button" className='ModalMap-button' onClick={handleClickOpen}>
                      Click here to mark the location on the map
                    </button>
                  </div></>
            )}
            
            <Form.Group controlId="capacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                value={parkingInfo.capacity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="openHour">
              <Form.Label>Open Hour</Form.Label>
              <Form.Control
                type="time"
                step="1"
                placeholder="Enter open hour"
                value={parkingInfo.openHour}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="closeHour">
              <Form.Label>Close Hour</Form.Label>
              <Form.Control
                type="time"
                step="1"
                placeholder="Enter close hour"
                value={parkingInfo.closeHour}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone"
                value={parkingInfo.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="pricexminute">
              <Form.Label>Price per minute</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the price per minute"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
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


export default AddParkingButton;
