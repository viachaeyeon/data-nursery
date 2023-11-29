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

  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap>
        <AiPredictionMain setPlanterClick={setPlanterClick} />
        <BarGraphAiWrap planterClick={planterClick} />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Prediction;
