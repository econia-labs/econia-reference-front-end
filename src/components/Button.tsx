import styled from "@emotion/styled";

export const Button = styled.button<{
  size: "sm" | "md" | "lg";
  variant: "primary" | "secondary" | "outline";
}>`
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.grey[100]
      : variant === "secondary"
      ? theme.colors.grey[700]
      : theme.colors.grey[800]}; // outline
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
  border: ${({ variant, theme }) =>
    variant === "outline" ? `1px solid ${theme.colors.grey[600]}` : "none"};
  cursor: pointer;
  :hover {
    background-color: ${({ variant, theme }) =>
      variant === "primary"
        ? theme.colors.grey[400]
        : variant === "secondary"
        ? theme.colors.grey[600]
        : theme.colors.grey[800]}; // outline
    color: ${({ variant, theme }) =>
      variant === "outline"
        ? theme.colors.purple.primary
        : theme.colors.grey[100]};
    border: ${({ variant, theme }) =>
      variant === "outline"
        ? `1px solid ${theme.colors.purple.primary}`
        : "none"};
  }
`;
