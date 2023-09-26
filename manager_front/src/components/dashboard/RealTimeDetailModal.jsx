import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";

// import useCreateTray from "@src/hooks/queries/planter/useCreateTray";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import { NumberCommaFormatting } from "@src/utils/Formatting";
import GraphTodayProduction from "@components/dashboard/GraphTodayProduction.jsx";

import XIcon from "@images/common/icon-x.svg";
import StatusOnIcon from "@images/dashboard/operation_status_on.svg";
import StatusOffIcon from "@images/dashboard/operation_status_off.svg";
import BarIcon from "@images/dashboard/icon-bar.svg";
// import { trayListKey } from "@src/utils/query-keys/PlanterQueryKeys";
import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 1502px;
    height: 1004px;
    /* padding: 56px 32px 40px 32px; */
    background-color: #fff;
    border-radius: 8px;
    /* padding: 40px; */
    padding: 16px 16px 40px 32px;
    display: flex;
    flex-direction: column;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: flex-end;
    /* justify-content: space-between; */

    /* .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 9px;
    } */
    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }
    .x-icon {
      cursor: pointer;
    }
  `,
  TitleBlock: styled.div`
    background-color: ${({ theme }) => theme.basic.whiteGray};
    border-radius: 8px;
    display: flex;
    padding: 20px 24px;
    align-items: center;
    justify-content: space-between;

    .left-inner {
      display: flex;
      align-items: center;
      gap: 16px;

      p {
        color: ${({ theme }) => theme.basic.deepBlue};
        ${({ theme }) => theme.textStyle.h4Bold};
      }
    }
    .right-inner {
      display: flex;
      gap: 8px;

      p {
        display: flex;
        align-items: center;
      }

      .detail-date {
        margin-right: 8px;
        color: ${({ theme }) => theme.basic.gray40};
        ${({ theme }) => theme.textStyle.h5Reguler};
      }

      .detail-count {
        color: ${({ theme }) => theme.basic.secondary};
        ${({ theme }) => theme.textStyle.h4Bold};
      }

      .detail-ing {
        color: ${({ theme }) => theme.basic.gray40};
        ${({ theme }) => theme.textStyle.h5Reguler};
      }
    }
  `,
  GraphWrap: styled.div`
    display: flex;
    margin-top: 48px;
    width: 100%;
    height: 100%;
    justify-content: space-between;

    .graph-inner-left {
      width: 100%;
    }
    .graph-inner-right {
      width: 100%;
    }
    .graph-title {
      display: flex;
      align-items: center;
      gap: 16px;

      p {
        color: ${({ theme }) => theme.basic.deepBlue};
        ${({ theme }) => theme.textStyle.h4Bold};
      }
    }
  `,
  Proceeding: styled.div`
    display: flex;
    flex-direction: column;
    gap: 17.5px;
    margin-top: 41.5px;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold};
    }

    .create-ing {
      display: flex;
      padding: 24px;
      border-radius: 8px;
      border: 3px solid ${({ theme }) => theme.basic.secondary};
      justify-content: space-between;
      align-items: center;
    }

    .create-ing-product {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .create-ing-text {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 8px;
    }

    .create-time {
      background-color: ${({ theme }) => theme.basic.whiteGray};
      border-radius: 8px;
      height: 24px;
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        color: ${({ theme }) => theme.basic.gray50};
      }
    }

    .production-count {
      display: flex;
      gap: 5px;

      p {
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.basic.gray60};
      }

      .num {
        ${({ theme }) => theme.textStyle.h4Bold};
      }
      .unit {
        ${({ theme }) => theme.textStyle.h5Reguler};
      }
    }
  `,
  Complete: styled.div`
    margin-top: 32px;

    .complete-title {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h6Bold};
    }

    .list-wrap {
      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h6Reguler};
      }

      .list-inner {
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .text-one {
        ${({ theme }) => theme.textStyle.h6Bold};
      }
      .text-two {
        ${({ theme }) => theme.textStyle.h7Bold};
      }
      .text-three {
        ${({ theme }) => theme.textStyle.h6Bold};
      }
    }
    .list-head {
      display: flex;
      justify-content: space-between;
      padding: 0px 46px 16px 40px;
    }
  `,
  ListBlockWrap: styled.div`
    max-height: 368px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;

    &::-webkit-scrollbar {
      display: block !important;
      width: 8px !important;
      border-radius: 4px !important;
      background-color: ${({ theme }) => theme.basic.lightSky} !important;
      margin-left: 5px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px !important;
      background-color: #bfcad9 !important;
    }
  `,
  ListBlock: styled.div`
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: ${({ theme }) => theme.basic.gray50} !important;
    }

    /* .text-one{
      ${({ theme }) => theme.textStyle.h6Bold};
    }
    .text-two{
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h7Bold};
    } */

    .text-img-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  `,
  Line: styled.div`
    background-color: ${({ theme }) => theme.basic.recOutline};
    width: 1px;
    height: 100%;
    margin-left: 59px;
    margin-right: 59px;
  `,
  Line2: styled.div`
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.basic.recOutline};
    margin: 16px 0px;
  `,
};

function RealTimeDetailModal({
  // setAddTrayModalOpen
  realTimeModalOpen,
  setRealTimeModalOpen,
}) {
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  const closeModal = useCallback(() => {
    setRealTimeModalOpen({ open: false, data: undefined });
  }, []);

  console.log("realTimeModalOpen", realTimeModalOpen);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          {/* <div className="text-wrap">
            <p className="title">제목</p>
          </div> */}
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.TitleBlock>
          <div className="left-inner">
            {realTimeModalOpen.data.planter_status === "ON" ? (
              <StatusOnIcon width={68} height={68} />
            ) : (
              <StatusOffIcon width={68} height={68} />
            )}
            <p>{realTimeModalOpen.data.farm_house_name}</p>
          </div>
          <div className="right-inner">
            <p className="detail-date">2023.08.18</p>
            <p className="detail-count">
              {NumberCommaFormatting(
                realTimeModalOpen.data.planter_output === null ? 0 : realTimeModalOpen.data.planter_output,
              )}
              개
            </p>
            {realTimeModalOpen.data.planter_status === "ON" && <p className="detail-ing">진행중</p>}
          </div>
        </S.TitleBlock>
        <S.GraphWrap>
          <div className="graph-inner-left">
            <div className="graph-title">
              <BarIcon width={5} height={28} />
              <p>오늘의 생산량</p>
            </div>
            {/* <GraphTodayProduction /> */}
          </div>
          <S.Line />
          <div className="graph-inner-right">
            <div className="graph-title">
              <BarIcon width={5} height={28} />
              <p>생산목록</p>
            </div>
            <S.Proceeding>
              <p>진행중</p>
              <div className="create-ing">
                <div className="create-ing-product">
                  <p>사진</p>
                  <div className="create-ing-text">
                    <div className="create-time">
                      <p>17:30 ~</p>
                    </div>
                    <p>토마토</p>
                  </div>
                </div>
                <div className="production-count">
                  <p className="num">{NumberCommaFormatting(54000)}</p>
                  <p className="unit">개</p>
                </div>
              </div>
            </S.Proceeding>
            <S.Complete>
              <p className="complete-title">작업완료</p>
              <S.Line2 />
              <div className="list-wrap">
                <div className="list-head">
                  <p>시작시간</p>
                  <p>작물명</p>
                  <p>총 파종량</p>
                </div>
                <S.ListBlockWrap>
                  <div className="list-inner">
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                    <S.ListBlock>
                      <p className="text-one">08:00</p>
                      <div className="text-img-wrap">
                        <div>이미지</div>
                        <p className="text-two">수박</p>
                      </div>
                      <p className="text-three">3000</p>
                    </S.ListBlock>
                  </div>
                </S.ListBlockWrap>
              </div>
            </S.Complete>
          </div>
        </S.GraphWrap>
      </S.WrapInner>
    </S.Wrap>
  );
}

export default RealTimeDetailModal;