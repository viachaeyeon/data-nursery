import { NumberFormatting } from "@src/utils/Formatting";
import React from "react";
import styled, { css } from "styled-components";

import NoneIcon from "@images/dashboard/none-icon.svg";
import BoxIcon from "@images/dashboard/icon-box.svg";
import { borderButtonColor, defaultButtonColor, purpleButtonColor, whiteButtonColor } from "@src/utils/ButtonColor";
import SuffixButton from "@components/common/button/SuffixButton";
import SmallButton from "@components/common/button/SmallButton";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    margin-bottom: 35px;

    .divider {
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.basic.grey20};
      margin: 16px 0px;
    }
  `,
  Content: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left;
    }

    .info-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      width: calc(100% - 90px);
    }

    .crop-text {
      ${({ theme }) => theme.textStyle.h5Regular}
    }

    .count-text-wrap {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      max-width: 100%;
    }

    .count-text {
      ${({ theme }) => theme.textStyle.h2BoldThin}
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey50};
      width: fit-content;
    }

    .gap-eight {
      gap: 8px;
    }
  `,
};

function WaitContent() {
  const testData = [
    {
      crop_name: "고추 #더강한청양",
      count: 332000,
      seed_quantity: "128공",
    },
    {
      crop_name: "고추 #더강한청양",
      count: 332000,
      seed_quantity: "128공",
    },
    {
      crop_name: "고추 #더강한청양",
      count: 332000,
      seed_quantity: "128공",
    },
  ];

  return (
    <S.Wrap>
      {testData.map((data, index) => {
        return (
          <>
            <S.Content key={`test${index}`}>
              <div className="info-wrap">
                <p className="crop-text">{data.crop_name}</p>
                <div className="count-text-wrap gap-eight">
                  <div className="count-text-wrap">
                    <p className="count-text">{NumberFormatting(data.count)}</p>
                    <p className="suffix-text">개</p>
                  </div>
                  <p className="suffix-text">{data.seed_quantity}</p>
                </div>
              </div>
              {/* <SuffixButton
                text={"시작"}
                onClick={() => {
                  alert("준비중입니다.");
                }}
                customStyle={purpleButtonColor}
              /> */}
              <SmallButton
                width="84px"
                text={"수정"}
                onClick={() => {
                  alert("준비중입니다.");
                }}
                customStyle={borderButtonColor}
              />
            </S.Content>
            {index !== testData.length - 1 && <div className="divider" />}
          </>
        );
      })}
    </S.Wrap>
  );
}

export default WaitContent;
