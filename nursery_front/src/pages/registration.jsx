import React, { useState } from "react";
import styled from "styled-components";

import MainLayout from "@components/layout/MainLayout";
import DefaultButton from "@components/common/button/DefaultButton";

import { defaultButtonColor } from "@src/utils/ButtonColor";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 102px 24px 24px 24px;
    overflow-y: auto;

    .description-text {
      ${({ theme }) => theme.textStyle.h3Bold};
      color: ${({ theme }) => theme.basic.darkBlue};
      white-space: pre-line;
    }
  `,
  InputWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40px !important;
    background-color: #fff;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.basic.grey30};
    margin: 72px 0px;
  `,
  CustomInput: styled.input`
    width: 100%;
    flex: 1;
    ${({ theme }) => theme.textStyle.h5Bold}
    color: ${({ theme }) => theme.basic.grey60};
    outline: none;
    border: none;
    box-shadow: none !important;

    &:focus {
      border: none;
    }

    &::placeholder {
      color: #a5a5a5 !important;
    }
  `,
};

function RegistrationPage() {
  const [serialNumber, setSerialNumber] = useState("");

  return (
    <MainLayout pageName={"파종기 등록"}>
      <S.Wrap>
        <p className="description-text">파종기 시리얼 번호를{"\n"}입력해주세요</p>
        <S.InputWrap>
          <S.CustomInput
            value={serialNumber}
            type={"text"}
            // maxLength={maxLength}
            placeholder={"예) KN001DS958"}
            onChange={(e) => {
              setSerialNumber(e.target.value);
            }}
          />
        </S.InputWrap>
        <DefaultButton
          text={"다음"}
          onClick={() => {
            alert("파종기 등록");
          }}
          customStyle={defaultButtonColor}
        />
      </S.Wrap>
    </MainLayout>
  );
}

export default RegistrationPage;
