import React from "react";

import { css, useTheme } from "@emotion/react";

export const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    size: "sm" | "md" | "lg";
    variant: "primary" | "secondary";
  }
> = (props) => {
  const theme = useTheme();
  return (
    <button
      css={css`
        background-color: ${props.variant === "primary"
          ? theme.colors.grey[100]
          : theme.colors.grey[700]};
        color: ${props.variant === "primary"
          ? theme.colors.grey[700]
          : theme.colors.grey[100]};
        padding: ${props.size === "sm"
          ? "18px 24px 16px"
          : props.size === "md"
          ? "26px 38px 24px"
          : "28px 56px 26px"};
        font-size: ${props.size === "sm"
          ? "16px"
          : props.size === "md"
          ? "18px"
          : "20px"};
        text-transform: uppercase;
        font-weight: 500;
        font-family: Roboto Mono, sans-serif;
        border: none;
        cursor: pointer;
      `}
      {...props}
    ></button>
  );
};
