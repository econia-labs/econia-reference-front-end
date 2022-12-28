import styled from "@emotion/styled";

export const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.grey[700]};
  border: ${({ theme }) => `1px solid ${theme.colors.grey[600]}`};
  color: ${({ theme }) => theme.colors.grey[100]};
  padding: 14px 0px 14px 23px;
  line-height: normal;
  outline: none;
  font-size: 16px;
`;