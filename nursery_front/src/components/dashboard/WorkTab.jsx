import React, { useState } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";

import NoneIcon from "@images/dashboard/none-icon.svg";
import theme from "@src/styles/theme";
import WorkContent from "@components/dashboard/WorkContent";
import WaitContent from "@components/dashboard/WaitContent";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    .no-work {
      margin-top: 48px;
    }

    ${({ theme }) => theme.media.max_mobile} {
      padding-bottom: 35px;
    }
  `,
  TabWrap: styled.div`
    display: flex;
    align-items: stretch;
    gap: 8px;
  `,
  TabContent: styled.div`
    flex: 1;
    height: 63px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;

    .tab-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey60};
    }

    img {
      margin-bottom: 8px;
    }

    .waiting-count-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .waiting-count-box {
      min-width: 56px;
      height: 32px;
      padding: 0px 8px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        ${({ theme }) => theme.textStyle.h5Bold}
        color: ${({ theme }) => theme.basic.grey50};
      }
    }

    .tab-bar {
      height: 4px;
      width: 100%;
      border-radius: 2px;
      background-color: ${({ theme }) => theme.basic.grey20};
      margin-top: 12px;
    }

    ${(props) =>
      props.isSelect &&
      css`
        .tab-text {
          ${({ theme }) => theme.textStyle.h5Bold}
        }

        .tab-bar {
          background-color: #5899fb;
        }
      `}
  `,
};

function WorkTab() {
  const [selectTab, setSelectTab] = useState("working");

  return (
    <S.Wrap>
      <S.TabWrap>
        <S.TabContent
          isSelect={selectTab === "working"}
          onClick={() => {
            setSelectTab("working");
          }}>
          <Image src={"/images/dashboard/working-ani.gif"} width={31} height={16} alt="working gif" />
          <p className="tab-text">작업중</p>
          <div className="tab-bar" />
        </S.TabContent>
        <S.TabContent
          isSelect={selectTab === "waiting"}
          onClick={() => {
            setSelectTab("waiting");
          }}>
          <div className="waiting-count-wrap">
            <p className="tab-text">대기중</p>
            <div className="waiting-count-box">
              <p>1건</p>
            </div>
          </div>
          <div className="tab-bar" />
        </S.TabContent>
      </S.TabWrap>
      {/* <div className="no-work">
        <NoneIcon width={50} height={50} fill={theme.basic.grey20} />
        {selectTab === "working" && <p>진행중인 작업이 없습니다</p>}
        {selectTab === "waiting" && <p>대기중인 작업이 없습니다</p>}
    </div> */}
      {selectTab === "working" && <WorkContent />}
      {selectTab === "waiting" && <WaitContent />}
    </S.Wrap>
  );
}

export default WorkTab;
