import React, { InputHTMLAttributes } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { SearchIcon } from "../assets/SearchIcon";
import { FlexRow } from "./FlexRow";
import { Input } from "./Input";

export const SearchInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <FlexRow
      className={className}
      css={css`
        position: relative;
      `}
    >
      <SearchIcon
        css={css`
          position: absolute;
          top: 15px;
          left: 8px;
        `}
      />
      <PaddedInput {...props} type="text" placeholder="SEARCH" />
    </FlexRow>
  );
};

const PaddedInput = styled(Input)`
  padding-left: 32px;
  width: 100%;
`;
