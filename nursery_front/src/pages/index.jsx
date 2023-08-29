import React from "react";

import MainLayout from "@components/layout/MainLayout";
import styled from "styled-components";

// import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    /* padding: 126px 24px 24px 24px; */
    overflow-y: auto;

    p {
      ${({ theme }) => theme.textStyle.h1Bold}
    }
  `,
};

function MainPage() {
  return (
    <MainLayout pageName={"main"}>
      <S.Wrap></S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
// export const getServerSideProps = requireAuthentication((context) => {
//   return {
//     redirect: {
//       destination: "/sign-in",
//       statusCode: 302,
//     },
//   };
// });

export default MainPage;
