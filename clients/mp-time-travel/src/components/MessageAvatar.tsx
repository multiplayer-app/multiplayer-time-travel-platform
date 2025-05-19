import React, { memo } from "react";

const MessageAvatar = ({ direction, character }) => {
  if (direction === "incoming") {
    return character?.avatar ? (
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

  return <div className="mtt-message-avatar mtt-outgoing" aria-hidden="true" />;
};

export default memo(MessageAvatar);
