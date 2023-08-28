import React, { useState } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";

import ExcelIcon from "@images/management/excel-icon.svg";
import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import UpArrow from "@images/common/order-by-up-icon.svg";
import DownArrow from "@images/common/order-by-down-icon.svg";
import OptionDot from "@images/common/option-dot-icon.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
  `,
  InfoBlock: styled.div`
    background-color: #fff;
    padding: 32px 56px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    .info-wrap {
      display: flex;
      justify-content: space-between;
    }

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-title {
      ${({ theme }) => theme.textStyle.h4Bold}
      color:${({ theme }) => theme.basic.deepBlue}
    }

    .info-sub {
      ${({ theme }) => theme.textStyle.h6Reguler}
      color:${({ theme }) => theme.basic.gray50}
    }

    .button-wrap {
      display: flex;
      gap: 16px;
    }
  `,

  ExcelButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border: 1px solid #5899fb;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: #5899fb;
      ${({ theme }) => theme.textStyle.h6Bold}
    }
  `,
  AddButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: #5899fb;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    width: 172px;

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h6Bold}
    }
  `,
  ContentList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .list-table-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 32px 6px 24px;
    }
    p {
      ${({ theme }) => theme.textStyle.h7Reguler}
    }

    .arrow-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .icon-wrap {
      cursor: pointer;
      align-items: center;
      display: flex;
    }

    .check-box {
      cursor: pointer;
    }
  `,

  ListBlock: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 32px 16px 24px;
    height: 68px;
    background-color: #fff;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    border-radius: 8px;
    align-items: center;
    margin-bottom: 16px;

    p {
      ${({ theme }) => theme.textStyle.h7Bold};
      color: ${({ theme }) => theme.basic.gray50};
    }
    .farm_number {
      width: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .farm_name_wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .farm-name-frist {
      background-color: #79cec8;
      border-radius: 30px;
      padding: 8px;
      color: #fff;
    }
    .farm_name {
      width: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .address {
      width: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .option-dot {
      cursor: pointer;
    }
  `,

  ButtonWrap: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MoreButton: styled.div`
    cursor: pointer;
    border-radius: 8px;
    width: 280px;
    padding: 16px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

    p {
      ${({ theme }) => theme.textStyle.h6Reguler}
      color:${({ theme }) => theme.basic.gray60}
    }
  `,
  AddressTooltip: styled(Tooltip)`
    border-radius: 8px !important;
    background-color: ${({ theme }) => theme.basic.gray60} !important;
    border: 1px solid ${({ theme }) => theme.basic.gray60} !important;
    padding: 8px 24px;

    p {
      color: #fff !important;
      ${({ theme }) => theme.textStyle.h7Reguler}
    }
  `,
};

function FarmList() {
  const [isAllCheckBox, setIsAllCheckBox] = useState(false);
  const [isNameOrderBy, setIsNameOrderBy] = useState(true);
  const [isStateOrderBy, setIsStateOrderBy] = useState(true);

  const nameOrderByToggle = () => {
    setIsNameOrderBy((prevIsNameOrderBy) => !prevIsNameOrderBy);
  };
  const stateOrderByToggle = () => {
    setIsStateOrderBy((prevIsStateOrderBy) => !prevIsStateOrderBy);
  };
  const AllCheckBoxToggle = () => {
    setIsAllCheckBox((prevIs) => !prevIs);
  };

  const listData = [
    {
      serial_number: "KN001DS0958",
      farm_id: "PF_0021350",
      farm_name: "하나공정육묘장영농조합법인",
      name: "이형채",
      farm_number: "제 13-부산-2018-06-01",
      address: "경상남도 밀양시 부북면 감운로 256 256",
      address_code: "50402",
      phone: "010-1234-1234",
      status: "ON",
    },
    {
      serial_number: "KN001DS0958 ",
      farm_id: "PF_0021350",
      farm_name: "가야프러그영농조합",
      name: "이형채",
      farm_number: "제 13-부산-2018-06-01",
      address: "경상남도 밀양시 부북면 감운로 256 256",
      address_code: "50402",
      phone: "010-1234-1234",
      status: "ON",
    },
    {
      serial_number: "KN001DS0958 ",
      farm_id: "PF_0021350",
      farm_name: "김해고송육묘",
      name: "이형채",
      farm_number: "제 13-부산-2018-06-01",
      address: "경상남도 밀양시 부북면 감운로 256 256",
      address_code: "50402",
      phone: "010-1234-1234",
      status: "ON",
    },
  ];

  return (
    <S.Wrap>
      <S.InfoBlock>
        <div className="info-wrap">
          <div className="text-wrap">
            <p className="info-title">전체 농가 목록</p>
            <p className="info-sub">농가 목록 추가, 수정, 삭제, QR코드 관리</p>
          </div>
          <div className="button-wrap">
            <S.ExcelButton>
              <ExcelIcon width={20} height={25} />
              <p>엑셀 내려받기</p>
            </S.ExcelButton>
            <S.AddButton>
              <AddIcon width={24} height={24} />
              <p>농가 추가</p>
            </S.AddButton>
          </div>
        </div>
      </S.InfoBlock>
      <S.ContentList>
        <div className="list-table-head">
          <div className="check-box" onClick={AllCheckBoxToggle}>
            {isAllCheckBox ? (
              <CheckBoxOn width={24} height={24} />
            ) : (
              <CheckBoxOff width={24} height={24} />
            )}
          </div>
          <p>파종기 S/N</p>
          <p>농가 ID</p>
          <div className="arrow-wrap">
            <p>농가명</p>
            <div className="icon-wrap" onClick={nameOrderByToggle}>
              {isNameOrderBy ? (
                <UpArrow width={24} height={24} />
              ) : (
                <DownArrow width={24} height={24} />
              )}
            </div>
          </div>
          <p>생산자명</p>
          <p>육묘업등록번호</p>
          <p>주소</p>
          <p>연락처</p>
          <div className="arrow-wrap">
            <p>상태</p>
            <div className="icon-wrap" onClick={stateOrderByToggle}>
              {isStateOrderBy ? (
                <UpArrow width={24} height={24} />
              ) : (
                <DownArrow width={24} height={24} />
              )}
            </div>
          </div>
          <p></p>
        </div>
        {listData.map((data, index) => {
          return (
            <S.ListBlock key={`map${index}`}>
              <CheckBoxOff width={24} height={24} />
              <p className="serial_number">{data.serial_number}</p>
              <p className="farm_id">{data.farm_id}</p>
              <div className="farm_name_wrap">
                <div className="farm-name-frist">
                  {data.farm_name.slice(0, 1)}
                </div>
                <p className="farm_name">{data.farm_name}</p>
              </div>
              <p className="name">{data.name}</p>
              <p className="farm_number">{data.farm_number}</p>
              <p className="address" id={`address${index}`}>
                {data.address}
              </p>
              <p className="phone">{data.phone}</p>
              <p className="status">{data.status}</p>
              <div className="option-dot">
                <OptionDot width={40} height={32} />
              </div>
              <S.AddressTooltip
                anchorId={`address${index}`}
                place="bottom"
                noArrow
                content={
                  <div className="text-wrap">
                    <p>
                      ({data.address_code}) {data.address}
                    </p>
                  </div>
                }
              />
            </S.ListBlock>
          );
        })}
        <S.ButtonWrap>
          <S.MoreButton>
            <p>더보기</p>
          </S.MoreButton>
        </S.ButtonWrap>
      </S.ContentList>
    </S.Wrap>
  );
}

export default FarmList;
