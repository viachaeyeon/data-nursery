import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useUserInfo from "@hooks/queries/auth/useUserInfo";

import MainLayout from "@components/layout/MainLayout";
import DefaultYearMonthSelect from "@components/common/calendar/DefaultYearMonthSelect";
import DefaultYearMonthList from "@components/common/calendar/DefaultYearMonthList";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import theme from "@src/styles/theme";
import DefaultHorizontalCalendar from "@components/common/calendar/DefaultHorizontalCalendar";
import { DateFormatting } from "@utils/Formatting";

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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 166px;
    background-color: ${({ theme }) => theme.basic.deepBlue};
    position: sticky;

    .select-wrap-padding {
      padding: 16px 0px;
    }
  `,
  ContentWrap: styled.div`
    padding: 38px 24px 36px 24px;
    height: calc(100% - 166px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: ${({ theme }) => theme.basic.whiteGrey};
  `,
  SelectedDateWrap: styled.div`
    width: fit-content;
    height: 34px;
    background-color: ${({ theme }) => theme.basic.grey20};
    padding: 8px;
    border-radius: 8px;

    p {
      ${({ theme }) => theme.textStyle.h7Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
};

function WorkHistoryPage() {
  const router = useRouter();

  // 선택한 년도, 월
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  // 년도, 월 Select open 여부
  const [yearMonthOpen, setYearMontOpen] = useState({
    year: false,
    month: false,
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
  // const { data: userInfo } = useUserInfo({
  //   successFn: () => {},
  //   errorFn: () => {
  //     // userLogout(router, clearQueries);
  //   },
  // });

  return (
    <MainLayout
      pageName={"작업이력"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor={theme.basic.deepBlue}
      buttonSetting={null}>
      <S.Wrap>
        <S.DateSelectWrap>
          <div className="select-wrap-padding">
            <DefaultYearMonthSelect
              date={date}
              yearMonthOpen={yearMonthOpen}
              handleYearMonthOpen={handleYearMonthOpen}
            />
          </div>
          <DefaultHorizontalCalendar date={date} handleDateChange={handleDateChange} />
        </S.DateSelectWrap>
        <S.ContentWrap>
          <S.SelectedDateWrap>
            <p>{DateFormatting(new Date(date.year, date.month, date.day))}</p>
          </S.SelectedDateWrap>
        </S.ContentWrap>
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

export default WorkHistoryPage;
