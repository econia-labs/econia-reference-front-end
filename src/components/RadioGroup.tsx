import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button } from "./Button";
import { FlexRow } from "./FlexRow";

export const RadioGroup: React.FC<{
  className?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({ className, options, value, onChange }) => {
  return (
    <FlexRow
      css={css`
        width: fit-content;
      `}
      className={className}
    >
      {options.map((option, i) => (
        <RadioButton
          selected={option === value}
          key={i}
          onClick={() => onChange(option)}
          size="sm"
          variant="secondary"
        >
          {option}
        </RadioButton>
      ))}
    </FlexRow>
  );
};

const RadioButton = styled(Button)<{ selected: boolean }>`
  flex-grow: 1;
  border-right: 1px solid ${({ theme }) => theme.colors.grey[700]};
  :last-of-type {
    border-right: none;
  }
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.grey[800] : theme.colors.grey[700]};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.grey[100] : theme.colors.grey[600]};
  :hover {
    transform: none;
    background-color: ${({ theme }) => theme.colors.grey[500]};
  }
`;
