import React, { useCallback, useState } from "react";
import styled from "styled-components";

import useManagerList from "@src/hooks/queries/auth/useManagerList";

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

import DeleteIcon from "@images/setting/icon-delete.svg";

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
      align-items: center;
      height: 52px;

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler}
      }

      .btn-wrap {
        width: 100%;
      }
    }
  `,
  ListBlockWrap: styled.div`
    max-height: 444px;
    overflow-y: auto;
    padding-right: 24px;

    .selected {
      border: 1px solid ${({ theme }) => theme.primery.primery};
    }

    .list-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-modal-wrap {
      position: relative;
    }
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
  SelectDeleteBtn: styled.div`
    border-radius: 8px;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.primery.primery};
    display: flex;
    gap: 6px;
    height: 32px;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin-left: 16px;

    p {
      color: ${({ theme }) => theme.blackWhite.white} !important;
      ${({ theme }) => theme.textStyle.h7Bold};
    }
  `,
};

function ManagementList() {

  const {data:managerList} = useManagerList ({
    page:1,
    size:15,
    successFn: () => {},
    errorFn: (err) => {
      console.log("!!err", err);
    },
  })

  console.log("managerList",managerList?.data)


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
  const [editManagerPwChangeModalOpen, setEditManagerPWChangeModalOpen] = useState({ open: false, data: undefined });

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

  // 선택삭제 클릭
  const handelSelectDeleteClick = useCallback(() => {
    alert("선택삭제");
  }, []);

  const [listData, setListData] = useState([
    {
      id: 0,
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
      id: 1,
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
    {
      id: 2,
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
    {
      id: 3,
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
    {
      id: 4,
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
    {
      id: 5,
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
    {
      id: 6,
      member_type: "second",
      accountId: "hanvia",
      company: "(주)헬퍼로보텍",
      department: "IT기획팀기획팀기획팀",
      position: "연구원연구원연구원",
      name: "홍길동",
      phone: "010-1111-1111",
      password: "5678",
    },
    {
      id: 7,
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

  const [selectAll, setSelectAll] = useState(false);
  const [isChecked, setIsChecked] = useState(managerList?.data?.map(() => false));
  const [checkArray, setCheckArray] = useState([]);

  const toggleItem = (index) => {
    const updatedIsCheckedArray = [...isChecked];
    updatedIsCheckedArray[index] = !updatedIsCheckedArray[index];
    setIsChecked(updatedIsCheckedArray);

    if (managerList?.data[index]?.member_type === "top") {
      // 'top' 항목은 개별적으로 선택해도 전체 선택에 영향을 주지 않음
      return;
    }

    // 모든 항목이 체크되었는지 확인
    const allChecked = updatedIsCheckedArray.every(
      (checked, index) => managerList?.data[index]?.member_type === "top" || checked,
    );

    // 모든 항목이 체크되었다면 전체 선택 체크박스를 true로 설정
    // 그렇지 않다면 전체 선택 체크박스를 false로 설정
    setSelectAll(allChecked);

    const selectedItemId = managerList?.data[index]?.id;
    if (updatedIsCheckedArray[index]) {
      setCheckArray((prevArray) => [...prevArray, selectedItemId]);
    } else {
      setCheckArray((prevArray) => prevArray.filter((id) => id !== selectedItemId));
    }
  };

  const toggleAll = () => {
    const allChecked = !selectAll;

    // 개별 항목 중 'member_type'이 'top'이 아닌 항목만 업데이트
    const updatedIsCheckedArray = isChecked.map((checked, index) =>
    managerList?.data[index].member_type === "top" ? checked : allChecked,
    );

    setIsChecked(updatedIsCheckedArray);
    setSelectAll(allChecked);

    const selectedIds = managerList?.data?.map((item) => item?.admin_user_info?.id);
    if (allChecked) {
      setCheckArray(selectedIds);
    } else {
      setCheckArray([]);
    }
  };


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
            <label>
              <input type="checkbox" checked={selectAll} onChange={toggleAll} style={{ display: "none" }} />
              <div>{selectAll ? <CheckBoxOn width={24} height={24} /> : <CheckBoxOff width={24} height={24} />}</div>
            </label>
          </div>
          {checkArray.length === 0 ? (
            <>
              <p>회원유형</p>
              <p>계정아이디</p>
              <p>회사명</p>
              <p>부서명</p>
              <p>직책</p>
              <p>이름</p>
              <p>연락처</p>
              <p></p>
            </>
          ) : (
            <>
              <div className="btn-wrap">
                <S.SelectDeleteBtn onClick={handelSelectDeleteClick}>
                  <DeleteIcon width={12} height={12} />
                  <p>선택삭제</p>
                </S.SelectDeleteBtn>
              </div>
            </>
          )}
        </div>
        <S.ListBlockWrap>
          <div className="list-inner">
            {managerList?.data?.map((data,item,index)=>{
              return(
                <S.ListBlock key={item.id} className={`table-row ${isChecked[index] ? "selected" : ""}`}>
                  {data?.admin_user_info?.is_top_admin === true ? (
                    <CheckBoxNone width={24} height={24} />
                  ) : (
                    <label key={item?.admin_user_info?.id} className="table-row">
                      <input
                        type="checkbox"
                        checked={isChecked[index]}
                        onChange={() => toggleItem(index)}
                        style={{ display: "none" }}
                      />
                      <div>
                        {isChecked[index] ? (
                          <CheckBoxOn width={24} height={24} />
                        ) : (
                          <CheckBoxOff width={24} height={24} />
                        )}
                      </div>
                      <div>{item?.user?.name}</div>
                    </label>
                  )}

                  {data.admin_user_info.is_top_admin === true ? (
                    <TopManager width={107} height={28} />
                  ) : (
                    <CommonManager width={107} height={28} />
                  )}
                  <p>{data?.user?.login_id}</p>
                  <p>{data?.admin_user_info?.company}</p>
                  <p>{data?.admin_user_info?.department}</p>
                  <p>{data?.admin_user_info?.position}</p>
                  <p>{data?.user?.name}</p>
                  <p>{data?.admin_user_info?.phone}</p>
                  <div className="option-modal-wrap">
                    <div
                      className="option-dot"
                      onClick={() => {
                        handleOptionModalClick(index, data);
                        setDeleteManagerModalOpen({ open: false, data: data });
                      }}>
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
                  </div>
                </S.ListBlock>
              )
            })}
            {/* {listData.map((data, index, item) => {
              return (
                <S.ListBlock key={item.id} className={`table-row ${isChecked[index] ? "selected" : ""}`}>
                  {data.member_type === "top" ? (
                    <CheckBoxNone width={24} height={24} />
                  ) : (
                    <label key={item.id} className="table-row">
                      <input
                        type="checkbox"
                        checked={isChecked[index]}
                        onChange={() => toggleItem(index)}
                        style={{ display: "none" }}
                      />
                      <div>
                        {isChecked[index] ? (
                          <CheckBoxOn width={24} height={24} />
                        ) : (
                          <CheckBoxOff width={24} height={24} />
                        )}
                      </div>
                      <div>{item.name}</div>
                    </label>
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
                  <div className="option-modal-wrap">
                    <div
                      className="option-dot"
                      onClick={() => {
                        handleOptionModalClick(index, data);
                        setDeleteManagerModalOpen({ open: false, data: data });
                      }}>
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
                  </div>
                </S.ListBlock>
              );
            })} */}
          </div>
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
          <ManagerDeleteModal setDeleteManagerModalOpen={setDeleteManagerModalOpen} />
        </div>
      )}
    </S.Wrap>
  );
}

export default ManagementList;
