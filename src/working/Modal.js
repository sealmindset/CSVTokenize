import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
  const modalRoot = document.getElementById('modal-root');

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-container">
        {children}
        <button className="modal-close-button" onClick={onClose}>Close</button>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;

