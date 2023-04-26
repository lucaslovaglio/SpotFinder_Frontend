import React, { useState } from 'react';
import "../pages/styles/modalPrueba.css"; // Archivo CSS para aplicar estilos

const OffCanvas = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el panel está abierto o cerrado

  // Función para manejar el evento de clic en el botón de apertura
  const handleOpenClick = () => {
    setIsOpen(true);
  };

  // Función para manejar el evento de clic en el botón de cierre
  const handleCloseClick = () => {
    setIsOpen(false);
  };

  return (
      <><button className="open-btn" onClick={handleOpenClick} style={{ position: 'absolute'}}>
      Show List
    </button>
    <div className={`off-canvas ${isOpen ? 'open' : ''}`}>
        <div className="off-canvas-content">
          <button className="close-btn" onClick={handleCloseClick}>
            Close
          </button>
          <h1>Parkings Availables</h1>
          {/* Aquí puedes agregar cualquier otro contenido que quieras mostrar en el OffCanvas */}
        </div>
      </div></>
  );
};

export default OffCanvas;
