import React from "react";

import MainLayout from "@components/layout/MainLayout";

// import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

function MainPage() {
  return <MainLayout></MainLayout>;
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
