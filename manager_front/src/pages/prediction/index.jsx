import React, { useState } from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";
import AiPredictionMain from "@components/prediction/AiPredictionMain";
import BarGraphAiWrap from "@components/prediction/BarGraphAiWrap";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
    min-width: 1500px;
  `,
};

function Prediction() {
  // 작물 선택 유무
  const [planterClick, setPlanterClick] = useState(false);
  // 어떤 작물 선택
  const [planterChoose, setPlanterChoose] = useState("");
  // 날짜 선택
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });

  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap>
        <AiPredictionMain
          setPlanterClick={setPlanterClick}
          planterChoose={planterChoose}
          setPlanterChoose={setPlanterChoose}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <BarGraphAiWrap
          planterClick={planterClick}
          planterChoose={planterChoose}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Prediction;
