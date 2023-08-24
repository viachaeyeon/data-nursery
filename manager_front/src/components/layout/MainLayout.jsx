import React from "react";
import styled from "styled-components";
import ManageSideMenu from "./MainSideMenu";

const S = {
  Wrap: styled.div`
    width: 100%;
    flex: 1;
    position: relative;
  `,
  MainContent: styled.main`
    align-items: stretch;
    display: flex;

    .main-children-section {
      flex: 1;
      padding: 64px 79px 112px 79px;
      background-color: #F7F7FA;

    }
  `,
};

function ManageLayout({ children }) {
  return (
    <S.Wrap>
      <S.MainContent>
        <ManageSideMenu />
        <section className="main-children-section">{children}</section>
      </S.MainContent>
    </S.Wrap>
  );
}

export default ManageLayout;
