import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { NumberCommaFormatting } from "@src/utils/Formatting";

import NoIcon from "@images/setting/crops-no-img.svg";

const S = {
  Wrap: styled.div`
    background-color: #fff;
    padding: 32px 32px 40px 56px;
    display: flex;
    flex-direction: column;
    gap: 43px;
  `,
  TitleHeader: styled.div`
    display: flex;
    justify-content: space-between;

    .title-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .title {
      ${({ theme }) => theme.textStyle.h4Bold};
      color: ${({ theme }) => theme.basic.deepBlue};
    }
    .sub-title {
      ${({ theme }) => theme.textStyle.h6Reguler};
      color: ${({ theme }) => theme.basic.gray50};
    }
  `,
  PlanterWrap: styled.div`
    display: flex;
    gap: 20px;

    .img-inner {
      cursor: pointer;
      border-radius: 100px;
      width: 184px;
      height: 184px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .yes-image {
      cursor: pointer;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100px;
      background-color: gray;
      width: 184px;
      height: 184px;
    }
  `,
  PlanterImg: styled.div``,

  PlanterDetail: styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: center;
  `,
  PlanterText: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    p {
      ${({ theme }) => theme.textStyle.h7Bold};
      /* color: ${({ theme }) => theme.basic.gray50}; */
    }
  `,
};

function AiPredictionMain({ setPlanterClick }) {
  const [planterChoose, setPlanterChoose] = useState("");

  const planterData = [
    { id: 1, name: "토마토", count: "1234567", img: true },
    { id: 2, name: "가지", count: "1234567", img: false },
    { id: 3, name: "고추", count: "1234567", img: false },
    { id: 4, name: "토마토", count: "1234567", img: true },
    { id: 5, name: "토마토", count: "1234567", img: false },
    { id: 6, name: "토마토", count: "1234567", img: true },
    { id: 7, name: "토마토", count: "1234567", img: false },
  ];

  // 작물 클릭시
  const handlePlanterChoose = useCallback((data) => {
    setPlanterChoose(data.id);
    setPlanterClick(true);
  }, []);

  return (
    <S.Wrap>
      <S.TitleHeader>
        <div className="title-text">
          <p className="title">생산예측</p>
          <p className="sub-title">작물별 파종량 대비 생산량 AI 예측</p>
        </div>
      </S.TitleHeader>
      <S.PlanterWrap>
        {planterData?.map((data) => {
          return (
            <S.PlanterDetail>
              {data.img ? (
                <S.PlanterImg
                  className="yes-image"
                  style={{ border: planterChoose === data.id && "1px solid #5899fb" }}
                  onClick={() => handlePlanterChoose(data)}
                />
              ) : (
                <S.PlanterImg
                  className="img-inner"
                  style={{ border: planterChoose === data.id && "1px solid #5899fb" }}
                  onClick={() => handlePlanterChoose(data)}>
                  <NoIcon width={184} height={184} />
                </S.PlanterImg>
              )}
              <S.PlanterText>
                <p style={{ color: planterChoose === data.id ? "#5899FB" : "#737F8F" }}>{data.name}</p>
                <p style={{ color: planterChoose === data.id ? "#5899FB" : "#737F8F" }}>
                  {NumberCommaFormatting(data.count)}kg
                </p>
              </S.PlanterText>
            </S.PlanterDetail>
          );
        })}
      </S.PlanterWrap>
    </S.Wrap>
  );
}

export default AiPredictionMain;
