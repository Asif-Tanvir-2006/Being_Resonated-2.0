import React from 'react';
import styles from './Modal.module.css'; // You can style the modal using a CSS module or other methods

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,0.6)] backdrop:blur-lg flex items-center justify-center bg-opacity-50">
      <div className="bg-[#2c2828] p-[20px] rounded-lg relative max-w-[500px] w-[100%]">
        <button className="absolute top-[10px] right-[10px] bg-none border-none cursor-pointer" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
