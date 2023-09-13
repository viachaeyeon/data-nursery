import React from "react";
import styled from "styled-components";

import useUserInfo from "@src/hooks/queries/auth/useUserInfo";

import ProfileIcon from "../../../public/images/common/icon-profile.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  DateWrap: styled.div`
    p {
      color: "#405F8D";
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
  `,
  profileWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 17.5px;

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.32px;
      color: #405f8d;
    }
  `,
};

function MainHeader({ currentDateTime }) {
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {},
  });

  return (
    <S.Wrap>
      <S.DateWrap>{/* <p>{currentDateTime}</p> */}</S.DateWrap>
      <S.profileWrap>
        <ProfileIcon width={21} height={22} />
        <p>안녕하세요, {userInfo?.user?.name}님</p>
      </S.profileWrap>
    </S.Wrap>
  );
}

export default MainHeader;
