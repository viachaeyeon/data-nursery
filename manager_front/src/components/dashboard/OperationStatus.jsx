import React from "react";
import styled from "styled-components";

import { Tooltip } from "react-tooltip";
import {
  NumberCommaFormatting,
  CountPlusFormatting,
} from "@src/utils/Formatting";
import BarIcon from "@images/common/dashboard/icon-bar.svg";
import StatusOnIcon from "@images/common/dashboard/operation_status_on.svg";
// import StatusOffIcon from "@images/common/dashboard/operation_status_off.svg";

const S = {
  Wrap: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    padding: 56px 56px 40px 56px;
    border-radius: 8px;
    background-color: #fff;
    height: 620px;
    width: 100%;
    gap: 28px;
    display: flex;
    flex-direction: column;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: start;
    align-items: flex-end;
    gap: 16px;

    .title {
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }
    .status-date {
      color: #929fa6;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
    }
  `,
  ContentWrap: styled.div`
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    overflow: scroll;
    padding-right: 5px;
  `,
  StatusBlock: styled.div`
    border-radius: 8px;
    border: 2px solid #fb97a3;
    padding: 20px 16px 20px 24px;
    width: fit-content;
    display: flex;
    gap: 16px;

    .block-text-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      cursor: default;
    }
    .block-count-wrap {
      display: flex;
    }
    .block-title {
      color: #737f8f;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 140px;
    }
    .block-count-wrap {
      display: flex;
      justify-content: start;
      align-items: center;
      gap: 4px;
    }
    .block-count {
      color: #fb97a3;
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }
    .block-unit {
      color: #979797;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: -0.32px;
    }
  `,
  StatusCountTooltip: styled(Tooltip)`
    border-radius: 8px !important;
    background-color: #4f5b6c !important;
    border: 1px solid #4f5b6c !important;
    padding: 12px 16px;

    .text-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .tooltip-title {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: #c2d6e1;
    }

    .count-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .count {
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
      color: #fff;
    }

    .unit {
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      color: #fff;
    }
  `,
};

function OperationStatus({ currentDate }) {
  const justMap = [
    1123, 23434, 1223, 4999888, 5, 60, 7344, 8, 9, 10, 11, 12, 13, 1400000, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];

  return (
    <S.Wrap>
      <S.TitleWrap>
        <BarIcon width={5} height={28} />
        <p className="title">실시간 가동현황</p>
        <p className="status-date">{currentDate}</p>
      </S.TitleWrap>
      <S.ContentWrap>
        {justMap.map((data, index) => {
          return (
            <S.StatusBlock key={`map${index}`}>
              <StatusOnIcon width={68} height={68} />
              {/* <StatusOffIcon width={68} height={68}/> */}
              <div className="block-text-wrap">
                <p className="block-title">하동공정육묘장영농조합법인</p>
                <div className="block-count-wrap">
                  <p className="block-count" id={`status-num${index}`}>
                    {CountPlusFormatting(data)}
                  </p>
                  <p className="block-unit">개</p>
                </div>
              </div>
              <S.StatusCountTooltip
                anchorId={`status-num${index}`}
                place="bottom"
                content={
                  <div className="text-wrap">
                    <p className="tooltip-title">누적파종량</p>
                    <div className="count-wrap">
                      <p className="count">{NumberCommaFormatting(data)}</p>
                      <p className="unit">개</p>
                    </div>
                  </div>
                }
              />
            </S.StatusBlock>
          );
        })}
      </S.ContentWrap>
    </S.Wrap>
  );
}

export default OperationStatus;
