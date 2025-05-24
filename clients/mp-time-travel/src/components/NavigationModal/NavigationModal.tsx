import React, { memo } from "react";
import Modal from "react-modal";
import "./navigationModal.scss";

// Required for accessibility
Modal.setAppElement("#root");

const NavigationModal = ({ isOpen, onClose, data }) => {
  const handleNavigate = () => {
    onClose();
    window.open(
      `https://go.multiplayer.app/project/${data.workspace}/${data.project}/default/debugger/session/${data._id}`,
      "_blank"
    );
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
