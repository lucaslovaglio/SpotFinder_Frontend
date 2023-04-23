import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuthProvider } from '../services/auth';

interface Props {
    id: string,
    iName: string,
    iLat: string,
    iLng: string,
    iCapacity: string,
    iOpenHs: string,
    iCloseHs: string,
    iPhone: string,
  }

const AddParkingButton: React.FC<Props> = ({ id, iName, iLat, iLng, iCapacity, iOpenHs, iCloseHs, iPhone }) => {
  const token = useAuthProvider().getCredentials().getToken();
  const [showModal, setShowModal] = useState(false);
  const [parkingInfo, setParkingInfo] = useState({
    name: iName,
    latitude: iLat,
    longitude: iLng,
    capacity: iCapacity,
    openHour: iOpenHs,
    closeHour: iCloseHs,
    phone: iPhone,
  });

  const handleClose = () => {
    setParkingInfo({
        name: iName,
        latitude: iLat,
        longitude: iLng,
        capacity: iCapacity,
        openHour: iOpenHs,
        closeHour: iCloseHs,
        phone: iPhone,
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
      alert(`
      // ${parkingInfo.name}
      `)
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Token en el header
        },
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
      const response = await axios.post("http://localhost:3001/parkings/" + id, config);
  
      if (response.status === 200) {
          alert('Parking modified successfully!')
      }
    } catch (error) {
      alert(error);
    }

    handleClose();
  };

  return (
    <>
      <Button className="parking-list-item-button" onClick={handleShow}>Edit</Button>
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
