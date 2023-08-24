import React from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";
import OutlineBlock from "@components/dashboard/outline-block";

const S = {
  Wrap: styled.div`
  margin-top: 24px;
  `,
};

function Dashboard() {
  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap><OutlineBlock /></S.Wrap>
    </MainLayout>
  );
}

export default Dashboard;
