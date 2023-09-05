import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

import PauseIcon from "@images/dashboard/icon-pause.svg";
import PlayIcon from "@images/dashboard/icon-play.svg";

const S = {
  ButtonWrap: styled(Button)`
    width: 100%;
    height: 56px;
    padding: 16px 32px !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    font-weight: 700 !important;
    font-size: 20px !important;
    line-height: 24px !important;
    border-radius: 8px !important;

    color: ${(props) => props.fontColor} !important;
    background-color: ${(props) => props.backgroundColor} !important;
    border-width: ${(props) => (props.fontColor === `#C2D6E1` ? "1px" : "2px")} !important;
    border-style: solid !important;
    border-color: ${(props) => props.borderColor} !important;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    cursor: ${(props) => (props.fontColor === `#C2D6E1` ? "auto" : "pointer")} !important;

    &:hover {
      background-color: ${(props) => props.hoverBackgroundColor} !important;
      border-color: ${(props) => props.hoverBorderColor} !important;
    }

    &:focus {
      background-color: ${(props) => props.focusBackgroundColor} !important;
      border-color: ${(props) => props.focusBorderColor} !important;
    }
  `,
};

function FontSmallDefaultButton({ type = "text", text, onClick, customStyle }) {
  return (
    <S.ButtonWrap
      backgroundColor={customStyle.backgroundColor}
      borderColor={customStyle.borderColor}
      hoverBackgroundColor={customStyle.hoverBackgroundColor}
      hoverBorderColor={customStyle.hoverBorderColor}
      focusBackgroundColor={customStyle.focusBackgroundColor}
      focusBorderColor={customStyle.focusBorderColor}
      fontColor={customStyle.fontColor}
      onClick={customStyle.fontColor === "#C2D6E1" ? () => {} : onClick}>
      {type === "text" && text}
      {type === "pause" && <PauseIcon />}
      {type === "play" && <PlayIcon />}
    </S.ButtonWrap>
  );
}

export default FontSmallDefaultButton;
