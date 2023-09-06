import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useTrayList from "@hooks/queries/planter/useTrayList";

import MainLayout from "@components/layout/MainLayout";
import DefaultInput from "@components/common/input/DefaultInput";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import { defaultButtonColor } from "@utils/ButtonColor";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    overflow-y: auto;
    padding: 16px 24px 29px 24px;
  `,
  InputWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .category-text {
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
};

function WorkInfoPage({ workId }) {
  const router = useRouter();

  // BottomButton 정보
  const [buttonSetting, setButtonSetting] = useState({
    color: defaultButtonColor,
    text: "시작",
    onClickEvent: () => {},
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

  // 트레이 목록 API
  const { data: trayList } = useTrayList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  return (
    <MainLayout
      pageName={"작업 정보"}
      backIconClickFn={() => {
        router.push("/");
      }}
      buttonSetting={buttonSetting}>
      <S.Wrap>
        <S.InputWrap>
          <p className="category-text">작업상태</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">작물</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">품종</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">트레이</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">주문수량</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">파종량</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication(async (context) => {
  if (!context.query.workId) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  } else {
    return {
      props: {
        workId: context.query.workId,
      },
    };
  }
});

export default WorkInfoPage;
