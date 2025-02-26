import React from "react"; 
import { FaTimes } from "react-icons/fa";
import { IoIosPlayCircle } from "react-icons/io";

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
      {/* Imagem de fundo com efeito blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-blur m-32"
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: "blur(8px)", // Efeito de desfoque
        }}
      ></div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 flex justify-center items-center w-full h-full">
        <div className="w-full h-full max-w-3xl max-h-[90%] flex flex-col justify-center items-center text-white">
          {/* Ícone de player */}
          <div className="text-6xl cursor-pointer animate-pulse">
            <IoIosPlayCircle size={100} />
          </div>

          {/* Fechar o Modal */}
          <div
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
          >
            <FaTimes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
