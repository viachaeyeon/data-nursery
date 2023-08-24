import React from "react";
import styled from "styled-components";

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

}

function OutlineBlock(){

    const farmHouseNum = "20"
    const cropsNum = "5"
    const planterNum = "20"
    const amountNum = "137M"

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
                        <p className="num">{amountNum}</p>
                    </S.TextWrap>
            </S.AmountBlock>
        </S.Wrap>
    )
}

export default OutlineBlock;