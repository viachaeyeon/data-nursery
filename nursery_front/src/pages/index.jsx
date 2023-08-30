import React from "react";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";
import Image from "next/image";

import MainLayout from "@components/layout/MainLayout";
import WorkTab from "@components/dashboard/WorkTab";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";
import TodayOutputIcon from "@images/dashboard/icon-output.svg";
import UseTimeIcon from "@images/dashboard/icon-time.svg";
import { NumberFormatting } from "@src/utils/Formatting";
import NoneIcon from "@images/dashboard/none-icon.svg";
import theme from "@src/styles/theme";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: 35px;
    overflow-y: auto;

    p {
      ${({ theme }) => theme.textStyle.h1Bold}
    }
  `,
  ScrollWrap: styled.div`
    width: 100%;
    height: 135px;
    margin-bottom: 5px;

    .scroll-container {
      height: 135px;
      display: flex;
      overflow-x: auto;
      gap: 16px;
      padding: 0px 24px;
    }

    .today-output {
      padding: 24px;
      background-color: ${({ theme }) => theme.basic.deepBlue};

      .row-layout p {
        ${({ theme }) => theme.textStyle.h7Bold}
        color: ${({ theme }) => theme.basic.grey30};
      }

      .data-wrap .bold-text {
        font-size: 28px;
        font-weight: 700;
        line-height: 28px;
      }
    }

    .best-kind {
      background-color: #5899fb;

      .row-layout p {
        color: ${({ theme }) => theme.mobile.sky};
      }
    }

    .use-time {
      background-color: ${({ theme }) => theme.mobile.secondary2};

      .row-layout p {
        color: ${({ theme }) => theme.mobile.dashboardFont};
      }
    }
  `,
  CardWrap: styled.div`
    min-width: 260px;
    max-width: 260px;
    height: 116px;
    padding: 24px 32px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(55, 80, 171, 0.3);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: #ffffff;
    }

    .row-layout {
      display: flex;
      align-items: center;
      gap: 8px;

      p {
        ${({ theme }) => theme.textStyle.h6Bold}
      }
    }

    .data-wrap {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      width: 100%;

      .bold-text {
        ${({ theme }) => theme.textStyle.h1Bold}
      }

      .suffix-text {
        ${({ theme }) => theme.textStyle.h5Regular}
      }
    }

    .time-wrap {
      display: flex;
      align-items: flex-end;
      gap: 16px;

      .data-wrap {
        gap: 2px;
      }
    }
  `,
  WorkWrap: styled.div`
    padding: 0px 24px;
    width: 100%;
    height: 100%;

    .no-work {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 12px;
      align-items: center;
      justify-content: center;

      p {
        ${({ theme }) => theme.textStyle.h5Bold}
        color: ${({ theme }) => theme.basic.grey50};
      }
    }
  `,
};

function MainPage() {
  return (
    <MainLayout pageName={"main"}>
      <S.Wrap>
        <S.ScrollWrap>
          <ScrollContainer className="scroll-container" horizontal={true}>
            <S.CardWrap className="today-output">
              <div className="row-layout">
                <TodayOutputIcon />
                <p>오늘의 생산량</p>
              </div>
              <div className="data-wrap">
                <p className="bold-text">{NumberFormatting(485000)}</p>
                <p className="suffix-text">개</p>
              </div>
            </S.CardWrap>
            <S.CardWrap className="best-kind">
              <div className="row-layout">
                <Image src={"/images/dashboard/icon-best.png"} width={24} height={24} alt="best kind image" />
                <p>BEST품종</p>
              </div>
              <div className="data-wrap">
                <p className="bold-text">{NumberFormatting(485000)}</p>
                <p className="suffix-text">개</p>
              </div>
            </S.CardWrap>
            <S.CardWrap className="use-time">
              <div className="row-layout">
                <UseTimeIcon />
                <p>사용시간 - 3회</p>
              </div>
              <div className="time-wrap">
                <div className="data-wrap">
                  <p className="bold-text">6</p>
                  <p className="suffix-text">시간</p>
                </div>
                <div className="data-wrap">
                  <p className="bold-text">20</p>
                  <p className="suffix-text">분</p>
                </div>
              </div>
            </S.CardWrap>
          </ScrollContainer>
        </S.ScrollWrap>
        <S.WorkWrap>
          {/* <div className="no-work">
            <NoneIcon width={50} height={50} fill={theme.basic.grey20} />
            <p>새 작업을 등록하세요!</p>
          </div> */}
          <WorkTab />
        </S.WorkWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default MainPage;
