import styled from "@emotion/styled";

export const DropdownMenu = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: absolute;
  z-index: 3;
  .menu-item {
    background-color: ${({ theme }) => theme.colors.grey[800]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey[600]};
    cursor: pointer;
    :last-of-type {
      border-bottom: none;
    }
    :hover {
      background-color: ${({ theme }) => theme.colors.grey[600]};
    }
  }
`;
