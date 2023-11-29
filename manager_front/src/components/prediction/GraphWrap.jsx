import React from "react";
import styled from "styled-components";

import BarIcon from "@images/dashboard/icon-bar.svg";

const S = {
  Wrap: styled.div`
    background-color: ${({ theme }) => theme.blackWhite.white};

    padding: 56px 40px 40px 40px;
  `,
  TitleWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    p {
      ${({ theme }) => theme.textStyle.h4Bold}
    }
  `,
};

function GraphWrap() {
  return (
    <S.Wrap>
      <S.TitleWrap>
        <BarIcon width={5} height={28} />
        <p>토마토 파종량</p>
      </S.TitleWrap>
      {/* <p>그래프</p> */}
    </S.Wrap>
  );
}

export default GraphWrap;
