import React from "react";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";

import MainLayout from "@components/layout/MainLayout";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 35px 0px;
    overflow-y: auto;

    p {
      ${({ theme }) => theme.textStyle.h1Bold}
    }
  `,
  ScrollWrap: styled.div`
    width: 100%;
    height: fit-content;
    margin-bottom: 24px;

    .scroll-container {
      display: flex;
      overflow-x: auto;
      gap: 16px;
      padding: 0px 24px;
    }

    .today-output {
      padding: 24px;
      background-color: ${({ theme }) => theme.basic.deepBlue};
    }

    .best-kind {
      background-color: #5899fb;
    }

    .use-time {
      background-color: ${({ theme }) => theme.mobile.secondary2};
    }
  `,
  CardWrap: styled.div`
    width: 260px;
    height: 116px;
    padding: 24px 32px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(55, 80, 171, 0.3);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  `,
};

function MainPage() {
  return (
    <MainLayout pageName={"main"}>
      <S.Wrap>
        <S.ScrollWrap>
          <ScrollContainer className="scroll-container" horizontal={true}>
            <S.CardWrap className="today-output"></S.CardWrap>
            <S.CardWrap className="best-kind"></S.CardWrap>
            <S.CardWrap className="use-time"></S.CardWrap>
          </ScrollContainer>
        </S.ScrollWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default MainPage;
