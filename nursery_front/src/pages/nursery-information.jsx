import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

import MainLayout from "@components/layout/MainLayout";
import DefaultModal from "@components/common/modal/DefaultModal";

import { defaultButtonColor } from "@src/utils/ButtonColor";
import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }
  `,
  FarmHouseNameWrap: styled.div`
    padding: 24px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 84px;
    background-color: #5899fb;
    position: sticky;

    p {
      ${({ theme }) => theme.textStyle.h3Bold}
      color: #ffffff;
    }
  `,
  InfoWrap: styled.div`
    padding: 38px 24px;
    height: calc(100% - 84px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,
  InfoContent: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    p {
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    .title-text {
      color: ${({ theme }) => theme.basic.grey50};
    }

    .value-box {
      border: 1px solid ${({ theme }) => theme.basic.lightSky};
      border-radius: 8px;
      padding: 6px 8px 6px 16px;
      height: 52px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      p {
        color: ${({ theme }) => theme.basic.grey60};
      }
    }
  `,
  LogoutButtonWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
  `,
  LogoutButton: styled(Button)`
    width: fit-content;
    height: 44px;
    padding: 12px 24px !important;

    display: flex;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.textStyle.h6Bold}
    border-radius: 8px !important;

    color: ${({ theme }) => theme.basic.grey50} !important;
    background-color: #ffffff !important;
    border: 1px solid ${({ theme }) => theme.basic.recOutline} !important;
  `,
};

function NurseryInfomationPage() {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
  });

  return (
    <MainLayout
      pageName={"농가정보"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor="#5899FB">
      <S.Wrap>
        <S.FarmHouseNameWrap>
          <p>가야프러그영농조합</p>
        </S.FarmHouseNameWrap>
        <S.InfoWrap>
          <S.InfoContent>
            <p className="title-text">파종기 S/N</p>
            <div className="value-box">
              <p>KN001DS0976</p>
            </div>
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">농가 ID</p>
            <div className="value-box">
              <p>PF_0021350</p>
            </div>
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">육묘업 등록번호</p>
            <div className="value-box">
              <p>제 13-부산-2018-60-01</p>
            </div>
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">주소</p>
            <div className="value-box">
              <p>(51010) 경남 김해시 화목동 1605-4</p>
            </div>
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">생산자명</p>
            <div className="value-box">
              <p>이형재</p>
            </div>
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">연락처</p>
            <div className="value-box">
              <p>055-314-5858</p>
            </div>
          </S.InfoContent>
          <S.LogoutButtonWrap>
            <S.LogoutButton
              onClick={() => {
                setModalOpen({
                  open: true,
                  type: "error",
                  title: "로그아웃을\n진행하시겠습니까?",
                  btnType: "two",
                  afterFn: () => {
                    alert("준비중입니다.");
                  },
                });
              }}>
              로그아웃
            </S.LogoutButton>
          </S.LogoutButtonWrap>
        </S.InfoWrap>
      </S.Wrap>
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default NurseryInfomationPage;
