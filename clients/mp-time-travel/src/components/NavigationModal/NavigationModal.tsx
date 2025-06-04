import React, { memo } from "react";
import Modal from "react-modal";
import { useTimeTravel } from "hooks/useTimeTravel";
import "./navigationModal.scss";

// Required for accessibility
Modal.setAppElement("#root");

const NavigationModal = ({ isOpen, onClose }) => {
  const { navigationUrl } = useTimeTravel();
  const handleNavigate = () => {
    if (navigationUrl) {
      onClose();
      window.open(navigationUrl, "_blank");
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
        You've just recorded a debugging session!
      </h2>
      <p className="mtt-navigation-modal-description">
        To view the session recording, which includes all traces, metrics and
        logs, click "Open."
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

export default memo(NavigationModal);
