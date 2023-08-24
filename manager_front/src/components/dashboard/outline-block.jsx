import React from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";

import { PriceFormatting,NumberUnitFormatting } from "@src/utils/Formatting";
import FarmHouseIcon from "@images/common/dashboard/farm-house-icon.svg";
import CropsIcon from "@images/common/dashboard/crops-icon.svg";
import PlanterIcon from "@images/common/dashboard/planter-icon.svg";
import AmountIcon from "@images/common/dashboard/amount-icon.svg";


const S = {
    Wrap:styled.div`
    display: flex;
    gap:16px;
    justify-content: space-between;

    `,
    TextWrap:styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;
        align-items: center;

        .title{
            font-size: 16px;
            font-weight: 700;
            line-height: 20px;
            color: #fff;
        }

        .num{
            font-size: 32px;
            font-weight: 700;
            line-height: 36px;
            color: #fff;
        }
    `,

    FarmhouseBlock:styled.div`
    background-color:#FFB78E;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap:70px;
    `,

    CropsBlock:styled.div`
    background-color:#967AE4;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap:70px;
    `,
    PlanterBlock:styled.div`
    background-color:#4B64BA;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap:70px;
    `,
    AmountBlock:styled.div`
    background-color:#FFB78E;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap:70px;
    `,

    AmountNumberTooltip: styled(Tooltip)`
        border-radius: 8px !important;
        background-color: #4F5B6C !important;
        border: 1px solid #4F5B6C !important;
        padding: 12px 16px;
    /* height: 71px; */

    .text-wrap{
      display :flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .title {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        color: #C2D6E1;
    }

    .count-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .count{
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px;
        color: #fff;
    }

    .unit{
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        color: #fff;
    }
    `,

}

function OutlineBlock(){

    //농가수
    const farmHouseNum = "20"
    //작물수
    const cropsNum = "5"
    //파종기
    const planterNum = "20"
    //누적파종량
    const amountNum ="1370993"

    console.log("formatting",PriceFormatting(amountNum))
    console.log("!!",NumberUnitFormatting(amountNum))

    return(
        <S.Wrap>
            <S.FarmhouseBlock>
                <div className="img"><FarmHouseIcon width={64} height={64} /></div>
                    <S.TextWrap>
                        <p className="title">농가수</p>
                        <p className="num">{farmHouseNum}</p>
                    </S.TextWrap>
            </S.FarmhouseBlock>
            <S.CropsBlock>
                <div className="img"><CropsIcon width={64} height={64} /></div>
                    <S.TextWrap>
                        <p className="title">작물수</p>
                        <p className="num">{cropsNum}</p>
                    </S.TextWrap>
            </S.CropsBlock>
            <S.PlanterBlock>
                <div className="img"><PlanterIcon width={64} height={64} /></div>
                    <S.TextWrap>
                        <p className="title">파종기</p>
                        <p className="num">{planterNum}</p>
                    </S.TextWrap>
            </S.PlanterBlock>
            <S.AmountBlock>
                <div className="img"><AmountIcon width={64} height={64} /></div>
                    <S.TextWrap>
                        <p className="title">누적파종량</p>
                        <div id="hover-icon"><p className="num">{NumberUnitFormatting(amountNum)}</p></div>
                    </S.TextWrap>
            </S.AmountBlock>
            <S.AmountNumberTooltip
                anchorId="hover-icon"
                place="bottom"
                content={
                    <div className="text-wrap">
                            <p className="title">누적파종량</p>
                        <div className="count-wrap">
                            <p className="count">{PriceFormatting(amountNum)}</p>
                            <p className="unit">개</p>
                        </div>
                    </div>
                        }
            />
        </S.Wrap>
    )
}

export default OutlineBlock;