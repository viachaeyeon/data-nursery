import React from "react";
import styled from "styled-components";

import PredictionBlock from "./PredictionBlock";
import GraphWrap from "./GraphWrap";

import PlantIcon from "@images/setting/plant-no-data.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  `,
  NoPlant: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;

    p {
      ${({ theme }) => theme.textStyle.h5Reguler};
      color: ${({ theme }) => theme.basic.gray50};
    }
  `,
};

function BarGraphAiWrap({ planterClick, planterChoose, dateRange, setDateRange }) {
  // 파종데이터(그래프,AI 예측에 사용)
  const sowingData = {
    crop_output: [
      {
        sowing_date: "Thu Nov 10 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 2000,
      },
      {
        sowing_date: "Thu Nov 11 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 1000,
      },
      {
        sowing_date: "Thu Nov 12 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 1500,
      },
      {
        sowing_date: "Thu Nov 13 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 500,
      },
      {
        sowing_date: "Thu Nov 14 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 800,
      },
      {
        sowing_date: "Thu Nov 15 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 168,
      },
      {
        sowing_date: "Thu Nov 16 2023 13:38:43 GMT+0900 (한국 표준시)",
        output: 2000,
      },
    ],
    total_output: 3333333,
    ai_predict: 55561123,
  };

  return (
    <S.Wrap>
      {planterClick ? (
        <>
          <GraphWrap planterChoose={planterChoose} sowingData={sowingData} dateRange={dateRange} />
          <PredictionBlock sowingData={sowingData} />
        </>
      ) : (
        <S.NoPlant>
          <PlantIcon width={41} height={43} />
          <p>작물을 선택하면 자세한 정보를 확인할 수 있어요</p>
        </S.NoPlant>
      )}
    </S.Wrap>
  );
}

export default BarGraphAiWrap;
