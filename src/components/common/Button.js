import styled from "@emotion/styled";
import React from "react";
import palette from "../../lib/styles/pallete";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

// fullWidth 스타일 함수
const fullWidthStyle = props =>
  props.fullWidth &&
  css`
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    width: 100%;
    font-size: 1.125rem;
  `;

// cyan 스타일 함수
const cyanStyle = props =>
  props.cyan &&
  css`
    background: ${palette.cyan[5]};
    &:hover {
      background: ${palette.cyan[4]};
    }
  `;

const buttonStyle = css`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }
`;

const StyledButton = styled.button`
  ${buttonStyle};
  ${fullWidthStyle};
  ${cyanStyle};
`;

const StyledLink = styled(Link)`
  ${buttonStyle};
  ${fullWidthStyle};
  ${cyanStyle};
`;

const Button = props => {
  return props.to ? (
    <StyledLink {...props} cyan={props.cyan ? 1 : 0} />
  ) : (
    <StyledButton {...props} />
  );
};

export default Button;
