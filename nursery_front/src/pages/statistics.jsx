import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useUserInfo from "@hooks/queries/auth/useUserInfo";

import MainLayout from "@components/layout/MainLayout";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import theme from "@src/styles/theme";

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
  DateSelectWrap: styled.div`
    padding: 24px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 76px;
    background-color: ${({ theme }) => theme.basic.deepBlue};
    position: sticky;

    p {
      ${({ theme }) => theme.textStyle.h3Bold}
      color: #ffffff;
    }
  `,
  ContentWrap: styled.div`
    padding: 38px 24px 36px 24px;
    height: calc(100% - 76px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: ${({ theme }) => theme.basic.whiteGrey};
  `,
};

function StatisticsPage() {
  const router = useRouter();

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      // userLogout(router, clearQueries);
    },
  });

  return (
    <MainLayout
      pageName={"통계현황"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor={theme.basic.deepBlue}>
      <S.Wrap>
        <S.DateSelectWrap>
          <p>날짜 넣을 예정</p>
        </S.DateSelectWrap>
        <S.ContentWrap></S.ContentWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default StatisticsPage;
