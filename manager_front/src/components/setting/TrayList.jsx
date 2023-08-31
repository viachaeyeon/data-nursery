import React, { useCallback, useState } from "react";
import styled from "styled-components";

import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import TrayIcon from "@images/setting/tray-no-data.svg";

const S = {
  Wrap: styled.div`
    width: 70%;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 36px 0px;
    border-bottom: 1px solid ${({ theme }) => theme.basic.recOutline};
  `,
  Title: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    .title {
      color: ${({ theme }) => theme.basic.deepBlue};
      ${({ theme }) => theme.textStyle.h4Bold}
    }
    .sub-title {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h6Reguler};
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
    border: 1px solid ${({ theme }) => theme.primery.primery};

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.btnAction};
    }
  `,
  ContentList: styled.div`
    .table-header {
      padding: 6px 32px 6px 24px;
      margin-top: 16px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler}
      }
    }
  `,
  ListBlockWrap: styled.div`
    height: 368px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  ListBlock: styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 16px 32px 16px 24px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h7Bold}
    }

    .option-dot {
      cursor: pointer;
    }

    .icon-wrap {
      align-items: center;
      display: flex;
      gap: 8px;
    }
  `,
  EmptyData: styled.div`
    height: 420px;
    margin-top: 168px;
    gap: 14px;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h5Reguler}
    }
  `,
};

function TrayList() {
  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });

  // 관리자목록 : 눌렀을때 나오는 모달
  const handleOptionModalClick = useCallback(
    (index, data) => {
      if (optionModalOpen.open === true) {
        setOptionModalOpen({ open: false, index: undefined, data: undefined });
      } else if (optionModalOpen.open === false) {
        setOptionModalOpen({ open: true, index: index, data: data });
      }
    },
    [optionModalOpen],
  );

  // 작물목록 : 눌렀을때 나오는 모달
  const handleCropsOptionModalClick = useCallback(
    (index, data) => {
      alert("트레이목록 옵션");
      // if (optionModalOpen.open === true) {
      //     setOptionModalOpen({ open: false, index: undefined, data: undefined });
      // } else if (optionModalOpen.open === false) {
      //     setOptionModalOpen({ open: true, index: index, data: data });
      // }
    },
    [optionModalOpen],
  );

  const [listData, setListData] = useState([
    {
      number: 1,
      tray_number: "32",
      width_count: "8",
      height_count: "4",
    },
    {
      number: 2,
      tray_number: "32",
      width_count: "8",
      height_count: "4",
    },
    {
      number: 3,
      tray_number: "32",
      width_count: "8",
      height_count: "4",
    },
    {
      number: 4,
      tray_number: "32",
      width_count: "8",
      height_count: "4",
    },
    {
      number: 5,
      tray_number: "32",
      width_count: "8",
      height_count: "4",
    },
  ]);
  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.Title>
          <p className="title">트레이목록</p>
          <p className="sub-title">트레이목록 추가, 변경</p>
        </S.Title>
        <S.AddButton>
          <AddIcon width={24} height={24} />
          <p>트레이 추가</p>
        </S.AddButton>
      </S.TitleWrap>
      <S.ContentList>
        {listData.length === 0 ? (
          <S.EmptyData>
            <TrayIcon width={56} height={56} />
            <p>등록된 트레이가 없습니다.</p>
          </S.EmptyData>
        ) : (
          <>
            <div className="table-header">
              <div>
                <CheckBoxOff width={24} height={24} />
              </div>
              <p>NO</p>
              <p>트레이공수</p>
              <p>가로</p>
              <p>세로</p>
              <p></p>
            </div>
            <S.ListBlockWrap>
              {listData.map((data, index) => {
                return (
                  <S.ListBlock key={`map${index}`}>
                    <CheckBoxOff width={24} height={24} />
                    <p>{data.number}</p>
                    <div className="icon-wrap">
                      <TrayIcon width={24} height={24} />
                      <p>{data.tray_number}</p>
                    </div>
                    <p>{data.width_count}</p>
                    <p>{data.height_count}</p>
                    <div
                      className="option-dot"
                      onClick={() => {
                        handleCropsOptionModalClick(index, data);
                      }}
                    >
                      <OptionDot width={32} height={32} />
                    </div>
                  </S.ListBlock>
                );
              })}
            </S.ListBlockWrap>
          </>
        )}
      </S.ContentList>
    </S.Wrap>
  );
}

export default TrayList;
