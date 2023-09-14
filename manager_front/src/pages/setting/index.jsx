import React, { useState, useEffect } from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";
import ManagementList from "@components/setting/ManagementList";
import CropsList from "@components/setting/CropsList";
import TrayList from "@components/setting/TrayList";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 72px;
    min-width: 1500px;
  `,
  BottomWrap: styled.div`
    display: flex;
    gap: 72px;
    justify-content: space-between;
    /* min-width: 1500px; */
  `,
};

function Setting() {
  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap>
        <ManagementList />
        <S.BottomWrap>
          <CropsList />
          <TrayList />
        </S.BottomWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Setting;
