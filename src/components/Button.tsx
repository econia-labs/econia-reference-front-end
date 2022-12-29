import styled from "@emotion/styled";

export const Button = styled.button<{
  size: "sm" | "md" | "lg";
  variant: "primary" | "secondary";
}>`
  background-color: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.grey[100] : theme.colors.grey[700]};
  color: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.grey[700] : theme.colors.grey[100]};
  padding: ${({ size }) =>
    size === "sm"
      ? "18px 24px 16px"
      : size === "md"
      ? "26px 38px 24px"
      : "28px 56px 26px"};
  font-size: ${({ size }) =>
    size === "sm" ? "16px" : size === "md" ? "18px" : "20px"};
  text-transform: uppercase;
  font-weight: 500;
  font-family: Roboto Mono, sans-serif;
  border: none;
  cursor: pointer;
  :hover {
    background-color: ${({ variant, theme }) =>
      variant === "primary" ? theme.colors.grey[400] : theme.colors.grey[600]};
  }
`;
