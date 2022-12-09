import styled from "@emotion/styled";

export const DropdownMenu = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: absolute;
  width: 200px;
  z-index: 3;
  div {
    background-color: ${({ theme }) => theme.colors.grey[800]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey[600]};
    width: 100%;
    cursor: pointer;
    :last-of-type {
      border-bottom: none;
    }
    :hover {
      background-color: ${({ theme }) => theme.colors.grey[600]};
    }
  }
`;
