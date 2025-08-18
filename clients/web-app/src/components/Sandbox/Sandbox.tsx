import React, { memo } from "react";
import Modal from "react-modal";
import SessionExample from "assets/mkt-sessions.png";
import { getSandboxLink, markSandboxClosed } from "utils/sandboxHelper";
import "./sandbox.scss";

const Sandbox = ({ isOpen, onClose }) => {
  const handleExploreSandbox = () => {
    window.open(getSandboxLink(), "_blank");
  };

  const onSandboxClose = () => {
    markSandboxClosed();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onSandboxClose}
      contentLabel="Time Travel demo app"
      className="mtt-modal mtt-sandbox-modal"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      overlayClassName="mtt-modal-overlay"
    >
      <button className="mtt-sandbox-close-button" onClick={onSandboxClose}>
        ×
      </button>

      <div className="mtt-sandbox-content">
        <div className="mtt-sandbox-background-gradient" />

        <div className="mtt-sandbox-text-section">
          <div className="mtt-sandbox-badge">Welcome to Multiplayer</div>
          <h2 className="mtt-sandbox-title">Time Travel demo app</h2>
          <p className="mtt-sandbox-description">
            This playful interactive demo powers our sandbox and shows
            Multiplayer full-stack session recordings in action. Everything you
            do will be captured and we’ve made sure to throw in a few unexpected
            bugs, so you can jump into the sandbox and start debugging!
          </p>

          <button
            className="mtt-sandbox-explore-button"
            onClick={onSandboxClose}
          >
            Explore the Demo
          </button>

          <p className="mtt-sandbox-legal">
            By entering sandbox you agree to our{" "}
            <a
              href="https://www.multiplayer.app/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="mtt-sandbox-link"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://www.multiplayer.app/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="mtt-sandbox-link"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>

        <div className="mtt-sandbox-image-section">
          <img
            src={SessionExample}
            alt="Session example"
            className="mtt-sandbox-image"
          />
        </div>
      </div>
    </Modal>
  );
};

export default memo(Sandbox);
