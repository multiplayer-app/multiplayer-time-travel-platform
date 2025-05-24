import React, { memo } from "react";
import userAvatar from "assets/chat-avatar.svg";
import "./messageAvatar.scss";

const MessageAvatar = ({ direction, character, systemError }) => {
  if (direction === "incoming") {
    return !systemError ? (
      <img
        src={character.avatar}
        alt={character.description}
        className="mtt-message-avatar mtt-incoming"
        loading="lazy"
        width="40"
        height="40"
      />
    ) : (
      <div
        className="mtt-message-avatar mtt-incoming-empty"
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={userAvatar}
      alt="user avatar"
      className="mtt-message-avatar mtt-outgoing"
      loading="lazy"
      width="40"
      height="40"
    />
  );
};

export default memo(MessageAvatar);
