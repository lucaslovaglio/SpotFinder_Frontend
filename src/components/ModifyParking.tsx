import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuthProvider } from '../services/auth';
import { faPen, faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import useUrlProvider from '../services/url';

  
interface Props {
    id: string,
    iName: string,
    iLat: number,
    iLng: number,
    iCapacity: string,
    iOpenHs: string,
    iCloseHs: string,
    iPhone: string,
    iPrice: number,
    handleRefresh: () => void,
}

type Park = {
  name: string,
  latitude: number,
  longitude: number,
  capacity: string,
  openHour: string,
  closeHour: string,
  phone: string,
  price: number,
}

const ModifyParkingButton: React.FC<Props> = ({ id, iName, iLat, iLng, iCapacity, iOpenHs, iCloseHs, iPhone, iPrice, handleRefresh }) => {
  const token = useAuthProvider().getCredentials().getToken();
  const url = useUrlProvider()
  const [showModal, setShowModal] = useState(false);
  const [newParkingInfo, setParkingInfo] = useState<Park>({
    name: iName,
    latitude: iLat,
    longitude: iLng,
    capacity: iCapacity,
    openHour: iOpenHs,
    closeHour: iCloseHs,
    phone: iPhone,
    price: iPrice,
})

  const handleClose = () => {
    setParkingInfo({
        name: iName,
        latitude: iLat,
        longitude: iLng,
        capacity: iCapacity,
        openHour: iOpenHs,
        closeHour: iCloseHs,
        phone: iPhone,
        price: iPrice,
    });
    setShowModal(false);
    handleRefresh();
  };
  
  const handleShow = () => setShowModal(true);

  const handleInputChange = (event: { target: { id: any; value: any; }; }) => {
    const { id, value } = event.target;
    !!newParkingInfo && setParkingInfo({ ...newParkingInfo, [id]: value });
  };

  const handleSave = async () => {
    // Lógica para agregar el parking con la información ingresada
    // Puedes acceder a los valores de los campos de entrada de información utilizando el estado parkingInfo

    //TODO arreglar la conexion con el back porq no funciona
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Token en el header
        },
      };
      const data = {
        "name": newParkingInfo?.name,
        "lat": newParkingInfo?.latitude,
        "lon": newParkingInfo?.longitude,
        "capacity": newParkingInfo?.capacity,
        "openHour": newParkingInfo?.openHour,
        "closeHour": newParkingInfo?.closeHour,
        "phone": newParkingInfo?.phone,
        "pricexminute": newParkingInfo?.price,
      }
      console.log(JSON.stringify(data))
      console.log(id)
      const response = await axios.post(url + "parkings/manageParkings/" + id, data, config);
  
      if (response.status === 200) {
          handleOpenAlert(()=>{}, Status.SUCCESS, 'Parking modified successfully!', false);
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

  return (
    <>
        <button className='buttons-header-owner' style={{backgroundColor: 'rgb(0, 255, 149)'}}  onClick={handleShow}>
          <FontAwesomeIcon icon={faPencil} style={{height: '.7rem', marginBottom: 8, color: '#030a18'}}/>
        </button>      
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Parking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newParkingInfo?.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="latitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter latitude"
                value={newParkingInfo?.latitude}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="longitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter longitude"
                value={newParkingInfo?.longitude}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="capacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter capacity"
                value={newParkingInfo?.capacity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="openHour">
              <Form.Label>Open Hour</Form.Label>
              <Form.Control
                type="time"
                step="1"
                placeholder="Enter open hour"
                value={newParkingInfo?.openHour}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="closeHour">
              <Form.Label>Close Hour</Form.Label>
              <Form.Control
                type="time"
                step="1"
                placeholder="Enter close hour"
                value={newParkingInfo?.closeHour}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone"
                value={newParkingInfo?.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price per minute</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the price per minute"
                value={newParkingInfo?.price}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
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


export default ModifyParkingButton;
