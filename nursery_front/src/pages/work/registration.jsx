import React, { useMemo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useCropList from "@hooks/queries/crop/useCropList";
import useTrayList from "@hooks/queries/planter/useTrayList";

import MainLayout from "@components/layout/MainLayout";
import DefaultInput from "@components/common/input/DefaultInput";
import DefaultCalendar from "@components/common/calendar/DefaultCalendar";
import SuffixInput from "@components/common/input/SuffixInput";
import DefaultSelect from "@components/common/select/DefaultSelect";
import DefaultSelectList from "@components/common/select/DefaultSelectList";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import { defaultButtonColor, disableButtonColor } from "@utils/ButtonColor";
import CalendarIcon from "@images/work/calendar-icon.svg";
import OnRadioBtnIcon from "@images/common/on-radio-btn.svg";
import OffRadioBtnIcon from "@images/common/off-radio-btn.svg";

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

  // BottomButton 정보
  const [buttonSetting, setButtonSetting] = useState({
    color: disableButtonColor,
    text: "등록완료",
    onClickEvent: () => {},
  });

  // 입력값 정보
  const [inputData, setInputData] = useState({
    crop_kind: "", // 품종
    sowing_date: new Date(), // 파종일
    deadline: new Date(), // 출하일
    order_quantity: "", // 주문수량
    seed_quantity: 0, // 파종량
    operating_time: "",
    planter_tray: "", // 트레이
    crop: "", // 작물
  });

  // 캘린더
  const [calendarOpen, setCalendarOpen] = useState({
    open: false,
    date: new Date(),
    afterFn: null,
  });

  // 작물 선택
  const [isCropSelectOpen, setIsCropSelectOpen] = useState(false);

  // 트레이 선택
  const [isTraySelectOpen, setIsTraySelectOpen] = useState(false);

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

  useEffect(() => {
    // 입력 값 중 빈값이 없을 경우
    if (!Object.values(inputData).includes("")) {
      setButtonSetting({
        color: defaultButtonColor,
        text: "등록완료",
        onClickEvent: () => {
          alert("등록!");
        },
      });
    } else {
      // 입력 값 중 빈값이 있을 경우
      setButtonSetting({
        color: disableButtonColor,
        text: "등록완료",
        onClickEvent: () => {},
      });
    }
  }, [inputData]);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      // userLogout(router, clearQueries);
    },
  });

  // 작물 목록 API
  const { data: cropList } = useCropList({
    successFn: () => {},
    errorFn: () => {},
  });

  // 트레이 목록 API
  const { data: trayList } = useTrayList({
    successFn: () => {},
    errorFn: () => {},
  });

  return (
    <MainLayout
      pageName={"작업 등록"}
      backIconClickFn={() => {
        router.push("/");
      }}
      buttonSetting={buttonSetting}>
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
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">작물</p>
          </div>
          <DefaultSelect
            isSelected={!!inputData.crop}
            text={!!inputData.crop ? inputData.crop.name : "작물을 선택하세요"}
            isSelectOpen={isCropSelectOpen}
            onClick={() => {
              setIsCropSelectOpen(!isCropSelectOpen);
            }}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">품종</p>
          </div>
          <DefaultInput
            text={inputData.crop_kind}
            setText={(e) => {
              handleInputChange("crop_kind", e.target.value);
            }}
            placeholder={"품종명을 입력하세요"}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">트레이</p>
          </div>
          <DefaultSelect
            isSelected={!!inputData.planter_tray}
            text={!!inputData.planter_tray ? inputData.planter_tray.total : "트레이를 선택하세요"}
            isSelectOpen={isTraySelectOpen}
            onClick={() => {
              setIsTraySelectOpen(!isTraySelectOpen);
            }}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">주문수량</p>
          </div>
          <SuffixInput
            text={inputData.order_quantity}
            setText={(e) => {
              handleInputChange("order_quantity", e.target.value);
            }}
            placeholder={"작업수량을 입력하세요"}
            suffix={"장"}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">파종량</p>
          </div>
          <SuffixInput text={inputData.seed_quantity} readOnly={true} suffix={"개"} />
        </S.InputWrap>
        <DefaultCalendar calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
        {isCropSelectOpen && (
          <DefaultSelectList>
            <p className="select-category-text">작물선택</p>
            <div className="value-list-wrap" id="scroll-wrap">
              {cropList?.crops.map((crop) => {
                return (
                  <div
                    key={crop.id}
                    className={`row-layout ${inputData.crop?.id === crop.id && "selected-value"}`}
                    onClick={() => {
                      handleInputChange("crop", crop);
                      setIsCropSelectOpen(false);
                    }}>
                    {inputData.crop?.id === crop.id && <OnRadioBtnIcon />}
                    {inputData.crop?.id !== crop.id && <OffRadioBtnIcon />}
                    <p className="value-text">{crop.name}</p>
                  </div>
                );
              })}
            </div>
          </DefaultSelectList>
        )}
        {isTraySelectOpen && (
          <DefaultSelectList>
            <p className="select-category-text">트레이 선택</p>
            <div className="value-list-wrap" id="scroll-wrap">
              {trayList?.planter_trays.map((tray) => {
                return (
                  <div
                    key={tray.id}
                    className={`row-layout ${inputData.planter_tray?.id === tray.id && "selected-value"}`}
                    onClick={() => {
                      handleInputChange("planter_tray", tray);
                      setIsTraySelectOpen(false);
                    }}>
                    {inputData.planter_tray?.id === tray.id && <OnRadioBtnIcon />}
                    {inputData.planter_tray?.id !== tray.id && <OffRadioBtnIcon />}
                    <p className="value-text">{tray.total}</p>
                  </div>
                );
              })}
            </div>
          </DefaultSelectList>
        )}
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default WorkRegistrationPage;
