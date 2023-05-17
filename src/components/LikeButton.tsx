import React, { useState } from 'react';
import '../styles/like.css';

const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    // Aquí puedes ejecutar la acción que desees al darle clic al botón de "Me gusta"
    // Por ejemplo, puedes enviar una solicitud al servidor para actualizar los datos.
  };

  return (
    <button className={liked ? 'like-button liked' : 'like-button' } onClick={handleLike}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="24"
        height="24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.05 2 12.12 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.62-3.4 6.55-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

export default LikeButton;
