import React, { memo } from "react";
import Modal from "react-modal";

// Required for accessibility
Modal.setAppElement("#root");

const ModalComponent = ({ isOpen, onClose }) => {
  const handleNavigate = () => {
    onClose();
    window.open("/target-page", "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Check your session"
      className="mtt-navigation-modal"
      shouldCloseOnOverlayClick={false}
      overlayClassName="mtt-navigation-modal-overlay"
    >
      <h2 className="mtt-navigation-modal-header">
        You've just recorded a debug session!
      </h2>
      <p className="mtt-navigation-modal-description">
        To see the session recording, traces, metrics and logs click the Open
        button below.
      </p>
      <div className="mtt-modal-buttons">
        <button className="mtt-modal-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="mtt-modal-button button-open"
          onClick={handleNavigate}
        >
          Open
        </button>
      </div>
    </Modal>
  );
};

export default memo(ModalComponent);
