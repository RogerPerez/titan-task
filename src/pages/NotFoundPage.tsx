import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <img
          src="/rogerLogo.png"
          alt="Descripción de la imagen"
          className=" w-[10vw] h-auto"
        />
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Page Not Found</p>
        <a href="/" className="text-lg text-blue-400 hover:underline">
          Go back to home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
