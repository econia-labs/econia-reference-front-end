import React, { PropsWithChildren } from "react";
import Modal from "react-modal";

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";

import { XIcon } from "../../assets/XIcon";
import { FlexRow } from "../FlexRow";

export const BaseModal: React.FC<Modal.Props & PropsWithChildren> = ({
  style,
  children,
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
          padding: "0px 72px",
          height: "fit-content",
          ...content,
        },
        overlay: {
          background: "none",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          zIndex: 3,
          ...overlay,
        },
        ...restStyle,
      }}
    >
      <CloseButtonContainer onClick={props.onRequestClose}>
        <XIcon />
      </CloseButtonContainer>
      {children}
    </Modal>
  );
};

const CloseButtonContainer = styled(FlexRow)`
  position: absolute;
  width: 71px;
  height: 71px;
  top: 0;
  right: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.purple.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.purple.primary};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    background: ${({ theme }) => theme.colors.purple.primary};
  }
`;
