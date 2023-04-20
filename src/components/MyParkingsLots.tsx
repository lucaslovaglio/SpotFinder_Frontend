import React from 'react';
import { Pagination, Button } from 'react-bootstrap';
import '../pages/styles/parkingList.css'; // Archivo de estilos CSS

type Parking = {
    id: number;
    name: string;
    // Otros campos del parking
};

type ParkingListProps = {
    parkings: Parking[];
};

const ParkingList: React.FC<ParkingListProps> = ({ parkings }) => {
    const parkingsPerPage = 5; // Cambiar el número de parkings por página según tus necesidades
    const [currentPage, setCurrentPage] = React.useState(1);
    
    const lastIndex = currentPage * parkingsPerPage;
    const firstIndex = lastIndex - parkingsPerPage;
    const currentParkings = parkings.slice(firstIndex, lastIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleRemoveParking = (parkingId: number) => {
        // Lógica para eliminar el parking con el ID especificado
        // Puedes definir tu propia lógica aquí
        console.log(`Eliminar parking con ID: ${parkingId}`);
    };

    const handleEdit = (parkingId: number) => {
        // Lógica para manejar la edición del parking
        // Puedes implementar tu propia lógica aquí
    };

    const handleConfirmRemove = (parkingId: number) => {
        // Utilizar ventana de confirmación de React-Bootstrap
        if (window.confirm('¿Estás seguro que quieres eliminar este parking?')) {
          handleRemoveParking(parkingId);
        }
    };

    return (
        <div className="parking-list-container">
            <h2 className="parking-list-title">My Parking Lots</h2>
            <ul className="parking-list">
                {currentParkings.map((parking, index) => (
                <li key={index} className="parking-list-item">
                    <div className="parking-list-item-content">
                        <div className="parking-list-item-name">{parking.name}</div>
                        <button className="parking-list-item-button">Edit</button>
                        <Button
                            variant="danger"
                            onClick={() => handleConfirmRemove(parking.id)} // Llamar a la función de confirmación con el ID del parking
                        >
                        Remove
                        </Button>
                    </div>
                    <hr className="parking-list-item-divider" />
                </li>
                ))}
            </ul>
            <div className="parking-list-pagination-container"> {/* Envolver la paginación en un div */}
                <Pagination className="parking-list-pagination">
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={lastIndex >= parkings.length}
                />
                </Pagination>
            </div>
        </div>
    );
};

export default ParkingList;
