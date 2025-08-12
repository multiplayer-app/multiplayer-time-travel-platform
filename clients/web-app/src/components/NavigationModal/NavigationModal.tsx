import React, { memo } from "react";
import Modal from "react-modal";
import { useTimeTravel } from "hooks/useTimeTravel";
import "./navigationModal.scss";

const NavigationModal = ({ isOpen, onClose }) => {
  const { navigationUrl } = useTimeTravel();

  const handleNavigate = () => {
    if (navigationUrl) {
      onClose();
      window.open(navigationUrl, "_blank");
      localStorage.removeItem("mp-navigation-url");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Check your session"
      className="mtt-modal"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      overlayClassName="mtt-modal-overlay"
    >
      <h2 className="mtt-navigation-modal-header">
        You've just recorded a session!
      </h2>
      <p className="mtt-navigation-modal-description">
        We’ve captured everything from frontend screens to deep backend traces,
        logs, request/response payloads and headers - all correlated by session.
      </p>
      <div className="mtt-modal-buttons">
        <button className="mtt-modal-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="mtt-modal-button button-open"
          onClick={handleNavigate}
        >
          View the recording
        </button>
      </div>
    </Modal>
  );
};

export default memo(NavigationModal);
