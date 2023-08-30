import { NumberFormatting } from "@src/utils/Formatting";
import React from "react";
import styled, { css } from "styled-components";

import FontSmallDefaultButton from "@components/common/button/FontSmallDefaultButton";

import NoneIcon from "@images/dashboard/none-icon.svg";
import BoxIcon from "@images/dashboard/icon-box.svg";
import { borderButtonColor, whiteButtonColor } from "@src/utils/ButtonColor";

const S = {
  Wrap: styled.div`
    background-color: ${({ theme }) => theme.basic.whiteGrey};
    border-radius: 8px;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  `,
  WorkInfo: styled.div`
    display: flex;
    align-items: flex-start;
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

    .text-wrap {
      width: calc(100% - 90px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .crop-name {
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
      color: ${({ theme }) => theme.basic.grey40};
      width: fit-content;
    }

    .seed-quantity-wrap {
      gap: 7px;
      margin-top: 10px;
    }

    .seed-quantity-text {
      color: ${({ theme }) => theme.basic.grey50};
      flex: 1;
    }
  `,
  CropImage: styled.div`
    width: 84px;
    height: 84px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      props.isCropImage
        ? css`
            background-color: none;
          `
        : css`
            background-color: #ebebf5;
          `}
  `,
  ButtonWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .row-layout {
      flex-direction: row;
      align-items: center;
    }

    .flex-one {
      flex: 1;
    }

    .flex-two {
      flex: 2;
    }
  `,
};

function WorkContent() {
  return (
    <S.Wrap>
      <S.WorkInfo>
        <div className="text-wrap">
          <p className="crop-name">미인풋고추</p>
          <div className="count-text-wrap">
            <p className="count-text">{NumberFormatting(520000)}</p>
            <p className="suffix-text">개</p>
          </div>
          <div className="count-text-wrap seed-quantity-wrap">
            <BoxIcon />
            <p className="suffix-text seed-quantity-text">520공</p>
          </div>
        </div>
        <S.CropImage isCropImage={false}>
          <NoneIcon width={25} height={25} fill={"#BCBCD9"} />
        </S.CropImage>
      </S.WorkInfo>
      <S.ButtonWrap>
        <S.ButtonWrap className="row-layout">
          <div className="flex-one">
            <FontSmallDefaultButton
              type={"pause"}
              onClick={() => {
                alert("준비중입니다.");
              }}
              customStyle={whiteButtonColor}
            />
          </div>
          <div className="flex-two">
            <FontSmallDefaultButton
              text={"작업정보"}
              onClick={() => {
                alert("준비중입니다.");
              }}
              customStyle={whiteButtonColor}
            />
          </div>
        </S.ButtonWrap>
        <FontSmallDefaultButton
          text={"작업완료"}
          onClick={() => {
            alert("준비중입니다.");
          }}
          customStyle={borderButtonColor}
        />
      </S.ButtonWrap>
    </S.Wrap>
  );
}

export default WorkContent;
