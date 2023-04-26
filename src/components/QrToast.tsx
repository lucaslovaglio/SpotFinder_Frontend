import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { Parking } from '../types/parkingTypes';
import { useAuthProvider } from '../services/auth';
import QRCode from 'react-qr-code';


interface Props {
    parking: Parking,
    token: string,
    showA: boolean,
    toggleShowA: () => void
  }

const QRToast: React.FC<Props> = ({parking, token, showA, toggleShowA}) => {
  return (
    <Row>
        <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{parking.name}</strong>
            <small>Use this QR code to enter</small>
          </Toast.Header>
          <Toast.Body>
            <QRCode value={token}/> 
          </Toast.Body>
        </Toast>
    </Row>
  );
}

export default QRToast;