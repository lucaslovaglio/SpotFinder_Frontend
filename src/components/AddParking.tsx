import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const AddParkingButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [parkingInfo, setParkingInfo] = useState({
    name: '',
    latitude: '',
    longitude: '',
    capacity: '',
    openHour: '',
    closeHour: '',
    phone: '',
  });

  const handleClose = () => {
    setParkingInfo({
      name: '',
      latitude: '',
      longitude: '',
      capacity: '',
      openHour: '',
      closeHour: '',
      phone: '',
    });
    setShowModal(false);
  };
  
  const handleShow = () => setShowModal(true);

  const handleInputChange = (event: { target: { id: any; value: any; }; }) => {
    const { id, value } = event.target;
    setParkingInfo({ ...parkingInfo, [id]: value });
  };

  const handleAdd = async () => {
    // Lógica para agregar el parking con la información ingresada
    // Puedes acceder a los valores de los campos de entrada de información utilizando el estado parkingInfo

    //TODO arreglar la conexion con el back porq no funciona
    try {
      alert(`${parkingInfo.openHour}`)
      const config = {
          body: {
            "name": parkingInfo.name,
            "lat": parkingInfo.latitude,
            "lon": parkingInfo.longitude,
            "capacity": parkingInfo.capacity,
            "openHour": parkingInfo.openHour,
            "closeHour": parkingInfo.closeHour,
            "phone": parkingInfo.phone,
          }
        };
      const response = await axios.post("http://localhost:3001/parkings/", config);
  
      if (response.status === 200) {
          alert('Parking added successfully!')
      }
    } catch (error) {
      alert(error);
    }

    // handleClose();
  };

  return (
    <>
      <Button onClick={handleShow}>Add Parking</Button>
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
            <Form.Group controlId="latitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter latitude"
                value={parkingInfo.latitude}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="longitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter longitude"
                value={parkingInfo.longitude}
                onChange={handleInputChange}
              />
            </Form.Group>
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
    </>
  );
}


export default AddParkingButton;
