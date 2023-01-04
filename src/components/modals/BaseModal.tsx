import React, { PropsWithChildren } from "react";
import Modal from "react-modal";

import { useTheme } from "@emotion/react";

export const BaseModal: React.FC<Modal.Props & PropsWithChildren> = ({
  style,
  ...props
}) => {
  let content = {};
  let overlay = {};
  let restStyle = {};
  if (style) {
    const {
      content: contentOverride,
      overlay: overlayOverride,
      ...restStyleOverride
    } = style;
    if (contentOverride) {
      content = contentOverride;
    }
    if (overlayOverride) {
      overlay = overlayOverride;
    }
    restStyle = restStyleOverride;
  }
  const theme = useTheme();
  return (
    <Modal
      {...props}
      style={{
        content: {
          background: theme.colors.grey[800],
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: `1px solid ${theme.colors.purple.primary}`,
          borderRadius: "0px",
          ...content,
        },
        overlay: {
          background: "none",
          backdropFilter: "blur(5px)",
          zIndex: 3,
          ...overlay,
        },
        ...restStyle,
      }}
    />
  );
};
