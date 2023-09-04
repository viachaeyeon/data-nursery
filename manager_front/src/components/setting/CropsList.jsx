import React, { useCallback, useState } from "react";
import styled from "styled-components";

import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import PlantIcon from "@images/setting/plant-no-data.svg";
import AddCropsModal from "./AddCropsModal";
import CropsOptionModal from "./CropsOptionModal";
import CropsDeleteModal from "./CropsDeleteModal";
import EditCropsModal from "./EditCropsModal";
import CropsImgDeleteModal from "./CropsImgDeleteModal";

const S = {
  Wrap: styled.div`
    width: 30%;

    .modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000040;
      z-index: 1;
    }
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

    .crops_color {
      width: 32px;
      height: 32px;
      border-radius: 30px;
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

function CropsList() {
  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });

  //작물 추가 정보
  const [cropsName, setCropsName] = useState("");
  const [cropsColor, setCropsColor] = useState("#929FA6");

  //작물 추가 모달 오픈
  const [addCropsModalOpen, setAddCropsModalOpen] = useState(false);

  //작물 이미지 추가
  const [image, setImage] = useState(null);

  //작물 이미지 수정
  const [editCropsImg, setEditCropsImg] = useState(null);

  //작물 삭제 모달 오픈
  const [deleteCropsModalOpen, setDeleteCropsModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //작물 수정 모달 오픈
  const [editCropsModalOpen, setEditCropsModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //작물 이미지 삭제 모달 오픈
  const [deleteCropsImgModalOpen, setDeleteCropsImgModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // 작물목록 : 눌렀을때 나오는 모달
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
      // alert("작물목록 옵션");
      if (optionModalOpen.open === true) {
        setOptionModalOpen({ open: false, index: undefined, data: undefined });
      } else if (optionModalOpen.open === false) {
        setOptionModalOpen({ open: true, index: index, data: data });
      }
    },
    [optionModalOpen],
  );

  // 작물 추가 모달
  const handleAddCropsModalClick = useCallback(() => {
    setAddCropsModalOpen(true);
  }, [addCropsModalOpen]);

  const [listData, setListData] = useState([
    {
      number: 1,
      crops_name: "토마토",
      crops_img: "",
      crops_color: "#EF7E7E",
    },
    {
      number: 2,
      crops_name: "수박",
      crops_img: "",
      crops_color: "#F7AD77",
    },
    {
      number: 3,
      crops_name: "오렌지",
      crops_img: "",
      crops_color: "#F9E37A",
    },
    {
      number: 4,
      crops_name: "복숭아",
      crops_img: "",
      crops_color: "#C6E37C",
    },
    {
      number: 5,
      crops_name: "자몽",
      crops_img: "",
      crops_color: "#71B598",
    },
    {
      number: 6,
      crops_name: "딸기",
      crops_img: "",
      crops_color: "#79CEC8",
    },
  ]);

  const CorpsColorList = [
    "#EF7E7E",
    "#F7AD77",
    "#F9E37A",
    "#C6E37C",
    "#71B598",
    "#79CEC8",
  ];

  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.Title>
          <p className="title">작물목록</p>
          <p className="sub-title">작물목록 추가, 변경</p>
        </S.Title>
        <S.AddButton onClick={handleAddCropsModalClick}>
          <AddIcon width={24} height={24} />
          <p>작물 추가</p>
        </S.AddButton>
      </S.TitleWrap>
      <S.ContentList>
        {listData.length === 0 ? (
          <S.EmptyData>
            <PlantIcon width={56} height={56} />
            <p>등록된 작물이 없습니다.</p>
          </S.EmptyData>
        ) : (
          <>
            <div className="table-header">
              <div>
                <CheckBoxOff width={24} height={24} />
              </div>
              <p>NO</p>
              <p>작물명</p>
              <p></p>
              <p></p>
            </div>
            <S.ListBlockWrap>
              {listData.map((data, index) => {
                return (
                  <S.ListBlock key={`map${index}`}>
                    <CheckBoxOff width={24} height={24} />
                    <p>{data.number}</p>
                    <div
                      className="crops_color"
                      style={{ backgroundColor: CorpsColorList[index] }}
                    />
                    <p>{data.crops_name}</p>
                    <div
                      className="option-dot"
                      onClick={() => {
                        handleCropsOptionModalClick(index, data);
                      }}
                    >
                      <OptionDot width={32} height={32} />
                    </div>
                    {index === optionModalOpen.index && (
                      <CropsOptionModal
                        optionModalOpen={optionModalOpen}
                        setOptionModalOpen={setOptionModalOpen}
                        deleteCropsModalOpen={deleteCropsModalOpen}
                        setDeleteCropsModalOpen={setDeleteCropsModalOpen}
                        // editCropsModalOpen={editCropsModalOpen}
                        setEditCropsModalOpen={setEditCropsModalOpen}
                        deleteCropsImgModalOpen={deleteCropsImgModalOpen}
                        setDeleteCropsImgModalOpen={setDeleteCropsImgModalOpen}
                      />
                    )}
                  </S.ListBlock>
                );
              })}
            </S.ListBlockWrap>
          </>
        )}
      </S.ContentList>

      {/* 작물추가 모달 */}
      {addCropsModalOpen && (
        <div className="modal-wrap">
          <AddCropsModal
            addCropsModalOpen={addCropsModalOpen}
            setAddCropsModalOpen={setAddCropsModalOpen}
            cropsName={cropsName}
            setCropsName={setCropsName}
            cropsColor={cropsColor}
            setCropsColor={setCropsColor}
            image={image}
            setImage={setImage}
          />
        </div>
      )}

      {/* 작물삭제 모달 */}
      {deleteCropsModalOpen.open && (
        <div className="modal-wrap">
          <CropsDeleteModal setDeleteCropsModalOpen={setDeleteCropsModalOpen} />
        </div>
      )}

      {/* 작물수정 모달 */}
      {editCropsModalOpen.open && (
        <div className="modal-wrap">
          <EditCropsModal
            editCropsModalOpen={editCropsModalOpen}
            setEditCropsModalOpen={setEditCropsModalOpen}
            deleteCropsImgModalOpen={deleteCropsImgModalOpen}
            setDeleteCropsImgModalOpen={setDeleteCropsImgModalOpen}
            editCropsImg={editCropsImg}
            setEditCropsImg={setEditCropsImg}
          />
        </div>
      )}

      {/* 작물이미지 삭제 모달 */}
      {deleteCropsImgModalOpen.open && (
        <div className="modal-wrap">
          <CropsImgDeleteModal
            deleteCropsImgModalOpen={deleteCropsImgModalOpen}
            setDeleteCropsImgModalOpen={setDeleteCropsImgModalOpen}
            setEditCropsImg={setEditCropsImg}
          />
        </div>
      )}
    </S.Wrap>
  );
}

export default CropsList;
