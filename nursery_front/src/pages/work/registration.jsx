import React, { useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

import useUserInfo from "@hooks/queries/auth/useUserInfo";

import MainLayout from "@components/layout/MainLayout";
import DefaultInput from "@components/common/input/DefaultInput";
import DefaultCalendar from "@components/common/calendar/DefaultCalendar";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import CalendarIcon from "@images/work/calendar-icon.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    overflow-y: auto;
    padding: 16px 24px;
  `,
  InputWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .category-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .category-text {
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
  CustomCalendarButton: styled(Button)`
    width: 100%;
    height: 52px;

    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;

    background-color: ${({ theme }) => theme.basic.lightSky} !important;
    border: 1px solid ${({ theme }) => theme.mobile.inputOutline} !important;
    border-radius: 8px !important;

    padding: 6px 8px 6px 16px !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    line-height: 20px !important;
    color: ${({ theme }) => theme.basic.grey60} !important;

    &:focus {
      border: 2px solid #5899fb !important;
    }

    svg {
      margin-right: 6px;
    }
  `,
};

function WorkRegistrationPage() {
  const router = useRouter();

  const [inputData, setInputData] = useState({
    deadline: new Date(),
  });

  const [calendarOpen, setCalendarOpen] = useState({
    open: false,
    date: new Date(),
    afterFn: null,
  });

  // 날짜 옵션
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
    calendar: "korean",
  };

  // 오늘 날짜
  const today = useMemo(() => {
    const date = new Date();
    return new Intl.DateTimeFormat("ko-KR", options).format(date).replaceAll(".", "/").split(" ");
  }, []);

  // 출하일
  const deadLineDate = useMemo(() => {
    return new Intl.DateTimeFormat("ko-KR", options).format(inputData.deadline).replaceAll(".", "/").split(" ");
  }, [inputData.deadline]);

  const handleInputChange = useCallback(
    (name, value) => {
      setInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [inputData],
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
      pageName={"작업 등록"}
      backIconClickFn={() => {
        router.push("/");
      }}>
      <S.Wrap>
        <S.InputWrap>
          <p className="category-text">육묘업 등록번호</p>
          <DefaultInput text={userInfo?.farm_house.nursery_number} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">주문자</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">파종일</p>
          <DefaultInput text={today[0] + today[1] + today[2].replace("/", "") + today[3]} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">출하일</p>
          </div>
          <S.CustomCalendarButton
            onClick={() => {
              setCalendarOpen({
                open: true,
                date: inputData.deadline,
                afterFn: (date) => {
                  handleInputChange("deadline", date);
                },
              });
            }}>
            {deadLineDate[0] + deadLineDate[1] + deadLineDate[2].replace("/", " ") + deadLineDate[3]}
            <CalendarIcon />
          </S.CustomCalendarButton>
        </S.InputWrap>
        <DefaultCalendar calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default WorkRegistrationPage;
