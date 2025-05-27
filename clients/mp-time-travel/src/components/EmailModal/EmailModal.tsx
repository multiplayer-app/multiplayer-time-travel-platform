import React, { memo, useState } from "react";
import Modal from "react-modal";
import {
  cursor1,
  cursor2,
  cursor3,
  emailIcon,
  loadingIcon,
} from "utils/constants";
import { validateEmail } from "utils/validateEmail";
import { submitEmail } from "services";
import { markEmailSubmitted } from "utils/emailModalStorage";
import "./emailModal.scss";

// Required for accessibility
Modal.setAppElement("#root");

const EmailModal = ({ isOpen, onClose }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await submitEmail(value);
      if (res.status === 204) {
        markEmailSubmitted();
        setLoading(false);
        onClose();
      } else {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An unexpected error occurred.");
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setError("");
  };

  const handleBlur = () => {
    const trimmed = value.trim();
    setValue(trimmed);
    if (trimmed && !validateEmail(trimmed)) {
      setError("Please enter a valid email.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmed = value.trim();
      setValue(trimmed);
      onValidate(trimmed);
    }
  };

  const onValidate = (val) => {
    if (!validateEmail(val)) {
      setError("Please enter a valid email.");
    } else {
      setError("");
      handleSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="DEMO PLAYGROUND"
      className="mtt-modal mtt-email-modal"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      overlayClassName="mtt-modal-overlay"
    >
      <div className="mtt-email-bg">
        <img
          src={cursor1}
          alt="cursor with name"
          className="mtt-email-bg-cursor"
        />
        <img
          src={cursor2}
          alt="cursor with name"
          className="mtt-email-bg-cursor"
        />
        <img
          src={cursor3}
          alt="cursor with name"
          className="mtt-email-bg-cursor"
        />
      </div>
      <div className="mtt-email-modal-body">
        <div className="mtt-email-modal-title">DEMO PLAYGROUND</div>
        <h2 className="mtt-email-modal-header">Explore Multiplayer!</h2>
        <div className="mtt-email-modal-description">
          <p>
            Drop in your email to try the Time Travel demo and experience our
            debugging firsthand. No sign-up required, just a quick way to show
            you what Multiplayer can do!
          </p>
          <div className="mtt-input-wrapper">
            <img
              src={loading ? loadingIcon : emailIcon}
              alt="email icon"
              className={`mtt-input-left-icon ${
                loading ? "mtt-icon-rotate" : ""
              }`}
            />
            <input
              type="email"
              className="mtt-demo-email"
              required={true}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email..."
            />
            {error && <div className="mtt-modal-error">{error}</div>}
          </div>
        </div>
        <div className="mtt-modal-footer">
          <button
            className="mtt-modal-button"
            onClick={() => onValidate(value)}
          >
            Start demo
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(EmailModal);
