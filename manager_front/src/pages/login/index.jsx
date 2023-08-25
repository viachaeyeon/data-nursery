import React, { useState } from "react";
import styled from "styled-components";

import Logo from "@images/common/logo-data-nursery.svg";
import UserIcon from "@images/common/ico-user.svg";
import PwIcon from "@images/common/icon-key.svg";
import CheckOn from "@images/common/check-icon-on.svg";
import CheckOff from "@images/common/check-icon-off.svg";

const S = {
  Wrap: styled.div`
    min-height: 100vh;
    background-image: url("/images/common/background.svg");
    background-size: cover;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
    display: flex;
  `,
  ContentWrap: styled.div`
    display: flex;
    flex-direction: column;
  `,

  TitleWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .welcome {
      color: #405f8d;
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }
    .logo-img {
      justify-content: center;
    }
    .title-info {
      color: #405f8d;
      font-size: 20px;
      font-weight: 400;
      line-height: 24px;
      margin-top: 16px;
      margin-bottom: 24px;
    }
  `,
  InputButtonWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  InputWrap: styled.div`
    border-radius: 8px;
    border: 1px solid #dcdcf0;
    background-color: #fff;
    padding: 20px 16px;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;

    .input-style {
      border: 0px;
    }
    input::placeholder {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 125% */
      letter-spacing: -0.32px;
      color: #929fa6;
    }
  `,
  IdSaveWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 11px;
    margin-top: 12px;

    p {
      color: #4f5b6c;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: -0.32px;
    }

    .check-box {
      cursor: pointer;
    }
  `,
  LoginButton: styled.div`
    border-radius: 8px;
    padding: 16px 32px;
    justify-content: center;
    align-items: center;
    display: flex;
    height: 57px;
    background-color: #5899fb;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    cursor: pointer;

    p {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #fff;
    }
  `,
};

function Login() {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [isSaveId, setIsSaveId] = useState(true);

  const toggleSaveId = () => {
    setIsSaveId((prevState) => !prevState);
  };

  return (
    <S.Wrap>
      <S.ContentWrap>
        <S.TitleWrap>
          <p className="welcome">welcome</p>
          <div className="logo-img">
            <Logo height={49} />
          </div>
          <p className="title-info">대한민국 NO.1 자동파종기 관리 시스템</p>
        </S.TitleWrap>
        <S.InputButtonWrap>
          <S.InputWrap>
            <UserIcon width={20} height={20} />
            <input
              className="input-style"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="아이디를 입력해주세요"
            />
          </S.InputWrap>
          <S.InputWrap>
            <PwIcon width={20} height={20} />
            <input
              className="input-style"
              value={inputPw}
              onChange={(e) => setInputPw(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
            />
          </S.InputWrap>
        </S.InputButtonWrap>
        <S.IdSaveWrap>
          <div className="check-box" onClick={toggleSaveId}>
            {isSaveId ? (
              <CheckOn width={24} height={24} />
            ) : (
              <CheckOff width={24} height={24} />
            )}
          </div>
          <p>아이디 저장</p>
        </S.IdSaveWrap>
        <S.LoginButton>
          <p>로그인</p>
        </S.LoginButton>
      </S.ContentWrap>
    </S.Wrap>
  );
}

export default Login;
