import React from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";

const S = {
  Wrap: styled.div`
  margin-top: 24px;
  `,
};

function Dashboard() {
  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap></S.Wrap>
    </MainLayout>
  );
}

export default Dashboard;