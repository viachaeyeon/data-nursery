import React, { useCallback, useState } from "react";
import styled from "styled-components";

import AddIcon from "@images/management/add-icon.svg";
import CheckBoxNone from "@images/setting/check-icon-none.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import TopManager from "@images/setting/top-manager.svg";
import CommonManager from "@images/setting/common-manager.svg";
import OptionModal from "./ManagerOptionModal";
import AddManagerModal from "./AddManagerModal";
import EditManagerModal from "./EditManagerModal";
import EditManagerPasswordModal from "./EditManagerPasswordModal";
import ManagerDeleteModal from "./ManagerDeleteModal";

const S = {
  Wrap: styled.div`
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
    padding: 24px 0px;
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
    max-height: 444px;
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
  `,
};

function ManagementList() {
  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });

  //관리자 추가 모달 오픈
  const [addManagerModalOpen, setAddManagerModalOpen] = useState(false);

  //관리자 수정 모달 오픈
  const [editManagerModalOpen, setEditManagerModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //관리자 비밀번호 변경 모달 오픈
  const [editManagerPwChangeModalOpen, setEditManagerPWChangeModalOpen] =
    useState({ open: false, data: undefined });

  //관리자 삭제모달 오픈
  const [deleteManagerModalOpen, setDeleteManagerModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //관리자 모달 정보
  const [managerId, setManagerId] = useState("");
  const [managerCompany, setManagerCompany] = useState("");
  const [managerDepartment, setManagerDepartment] = useState("");
  const [managerPosition, setManagerPosition] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerPassword, setManagerPassword] = useState("");

  //관리자 추가 모달
  const handelAddManagerModalClick = useCallback(() => {
    setAddManagerModalOpen(true);
  }, [addManagerModalOpen]);

  // : 눌렀을때 나오는 모달
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

  const [listData, setListData] = useState([
    {
      member_type: "top",
      accountId: "helperrobotec",
      company: "(주)헬퍼로보텍",
      department: "해외마케팅",
      position: "팀장",
      name: "박희진",
      phone: "010-0000-0000",
      password: "1234",
    },
    {
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
  ]);
  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.Title>
          <p className="title">관리자목록</p>
          <p className="sub-title">관리자 추가 및 변경</p>
        </S.Title>
        <S.AddButton onClick={handelAddManagerModalClick}>
          <AddIcon width={24} height={24} />
          <p>관리자 추가</p>
        </S.AddButton>
      </S.TitleWrap>
      <S.ContentList>
        <div className="table-header">
          <div>
            <CheckBoxOff width={24} height={24} />
          </div>
          <p>회원유형</p>
          <p>계정아이디</p>
          <p>회사명</p>
          <p>부서명</p>
          <p>직책</p>
          <p>이름</p>
          <p>연락처</p>
          <p></p>
        </div>
        <S.ListBlockWrap>
          {listData.map((data, index) => {
            return (
              <S.ListBlock key={`map${index}`}>
                {data.member_type === "top" ? (
                  <CheckBoxNone width={24} height={24} />
                ) : (
                  <CheckBoxOff width={24} height={24} />
                )}
                {data.member_type === "top" ? (
                  <TopManager width={107} height={28} />
                ) : (
                  <CommonManager width={107} height={28} />
                )}
                <p>{data.accountId}</p>
                <p>{data.company}</p>
                <p>{data.department}</p>
                <p>{data.position}</p>
                <p>{data.name}</p>
                <p>{data.phone}</p>
                <div
                  className="option-dot"
                  onClick={() => {
                    handleOptionModalClick(index, data);
                    setDeleteManagerModalOpen({ open: false, data: data });
                  }}
                >
                  <OptionDot width={32} height={32} />
                </div>
                {index === optionModalOpen.index && (
                  <OptionModal
                    optionModalOpen={optionModalOpen}
                    setOptionModalOpen={setOptionModalOpen}
                    setEditManagerModalOpen={setEditManagerModalOpen}
                    deleteManagerModalOpen={deleteManagerModalOpen}
                    setDeleteManagerModalOpen={setDeleteManagerModalOpen}
                  />
                )}
              </S.ListBlock>
            );
          })}
        </S.ListBlockWrap>
      </S.ContentList>

      {/* 관리자추가 모달 */}
      {addManagerModalOpen && (
        <div className="modal-wrap">
          <AddManagerModal
            setAddManagerModalOpen={setAddManagerModalOpen}
            managerId={managerId}
            setManagerId={setManagerId}
            managerCompany={managerCompany}
            setManagerCompany={setManagerCompany}
            managerDepartment={managerDepartment}
            setManagerDepartment={setManagerDepartment}
            managerPosition={managerPosition}
            setManagerPosition={setManagerPosition}
            managerName={managerName}
            setManagerName={setManagerName}
            managerPhone={managerPhone}
            setManagerPhone={setManagerPhone}
            managerPassword={managerPassword}
            setManagerPassword={setManagerPassword}
          />
        </div>
      )}

      {/* 관리자 수정 모달 */}
      {editManagerModalOpen.open && (
        <div className="modal-wrap">
          <EditManagerModal
            editManagerModalOpen={editManagerModalOpen}
            setEditManagerModalOpen={setEditManagerModalOpen}
            setEditManagerPWChangeModalOpen={setEditManagerPWChangeModalOpen}
          />
        </div>
      )}

      {/* 관리자 비밀번호 변경 모달 */}
      {editManagerPwChangeModalOpen.open && (
        <div className="modal-wrap">
          <EditManagerPasswordModal
            editManagerModalOpen={editManagerModalOpen}
            setEditManagerPWChangeModalOpen={setEditManagerPWChangeModalOpen}
            setManagerPassword={setManagerPassword}
          />
        </div>
      )}

      {/* 관리자 삭제모달 */}
      {deleteManagerModalOpen.open && (
        <div className="modal-wrap">
          <ManagerDeleteModal
            setDeleteManagerModalOpen={setDeleteManagerModalOpen}
          />
        </div>
      )}
    </S.Wrap>
  );
}

export default ManagementList;
