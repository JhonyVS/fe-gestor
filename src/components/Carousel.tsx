// src/components/Carousel.tsx
import React, { useState, useEffect } from 'react';

const images = [
  '/src/assets/images/image1.jpeg',
  '/src/assets/images/image2.jpeg',
  '/src/assets/images/image3.jpeg',
  '/src/assets/images/image4.jpeg',
  '/src/assets/images/image5.jpeg',
  '/src/assets/images/image6.jpeg',
  '/src/assets/images/image7.jpeg',
];

const Carousel: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // aqui podemos cambiar el tiempo de cambio entre imagenes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel w-full h-full absolute top-0 left-0">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Project related ${index}`}
          className={`absolute inset-0 w-full h-full object-cover ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export default Carousel;
