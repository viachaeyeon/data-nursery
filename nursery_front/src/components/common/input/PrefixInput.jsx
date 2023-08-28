import React from "react";
import styled from "styled-components";

import IdIcon from "@images/sign-in/id-icon.svg";
import PasswordIcon from "@images/sign-in/password-icon.svg";

const S = {
  InputWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    height: 60px !important;
    max-height: 60px !important;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px 24px 20px 16px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    gap: 10px;

    /* &:focus-within {
      border-color: ${({ theme }) => theme.secondery};
    } */
  `,
  CustomInput: styled.input`
    width: 100%;
    flex: 1;
    font-size: 18px;
    line-height: 20px;
    letter-spacing: -0.36px;
    outline: none;
    border: none;
    box-shadow: none !important;
    /* color: ${({ theme }) => theme.neutral.eight}; */

    &:focus {
      border: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.basic.grey40} !important;
    }
  `,
};

function PrefixInput({ text, setText, type = "text", maxLength, placeholder, borderRadius = "16px", enterKeyUpFn }) {
  return (
    <S.InputWrap>
      {type === "text" ? <IdIcon /> : <PasswordIcon />}
      <S.CustomInput
        borderRadius={borderRadius}
        value={text}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={setText}
        onKeyUp={!!enterKeyUpFn ? enterKeyUpFn : null}
      />
    </S.InputWrap>
  );
}

export default PrefixInput;
