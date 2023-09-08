import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useUserInfo from "@hooks/queries/auth/useUserInfo";

import MainLayout from "@components/layout/MainLayout";
import DefaultYearMonthSelect from "@components/common/calendar/DefaultYearMonthSelect";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import theme from "@src/styles/theme";
import DefaultYearMonthList from "@components/common/calendar/DefaultYearMonthList";

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

  const [yearMonthOpen, setYearMontOpen] = useState({
    year: false,
    month: false,
  });
  // const [isYearOpen, setIsYearOpen] = useState(false);
  // const [isMonthOpen, setIsMonthOpen] = useState(false);

  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // 날짜 변경
  const handleDateChange = useCallback(
    (name, value) => {
      setDate((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [date],
  );

  // 년도, 월 오픈 변경
  const handleYearMonthOpen = useCallback(
    (name, value) => {
      setYearMontOpen((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [yearMonthOpen],
  );

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
          <DefaultYearMonthSelect date={date} yearMonthOpen={yearMonthOpen} handleYearMonthOpen={handleYearMonthOpen} />
        </S.DateSelectWrap>
        <S.ContentWrap></S.ContentWrap>
        <DefaultYearMonthList
          date={date}
          yearMonthOpen={yearMonthOpen}
          handleDateChange={handleDateChange}
          handleYearMonthOpen={handleYearMonthOpen}
        />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default StatisticsPage;
