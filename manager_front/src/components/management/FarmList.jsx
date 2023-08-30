import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";

// import DaumPostcode from "react-daum-postcode";
import OptionModal from "./OptionModal";
import AddFarmModal from "./AddFarmModal";
import AddFarmSaveModal from "./AddFarmSaveModal";
import QrDownloadModal from "./QrDownloadModal";
import DeleteModal from "./DeleteModal";

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

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.lightSky};
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

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.btnAction};
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
      ${({ theme }) => theme.textStyle.h7Reguler};
      color: ${({ theme }) => theme.basic.gray60};
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
    .status-on {
      color: ${({ theme }) => theme.primery.primery};
    }
    .status-off {
      color: ${({ theme }) => theme.basic.gray30};
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

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.recOutline};
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
  const [isOneCheckBox, setIsOneCheckBox] = useState(false);
  const [isNameOrderBy, setIsNameOrderBy] = useState(true);
  const [isStateOrderBy, setIsStateOrderBy] = useState(true);
  // 농가추가시 작성하는 시리얼넘버
  const [addFarmSerialNumber, setAddFarmSerialNumber] = useState("");
  // 농가추가시 필요한 데이터
  const [nurseryRegNumber, setNurseryRegNumber] = useState("");
  const [farmId, setFarmId] = useState("");
  const [farmName, setFarmName] = useState("");
  const [producerName, setProducerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressData, setAddressData] = useState("");
  const [addressDetailData, setAddressDetailData] = useState("");

  // ...클릭시 나오는 모달
  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });
  //농가 추가 모달
  const [addFarmModalOpen, setAddFarmModalOpen] = useState(false);
  //농가 추가 step2 모달
  const [addFarmSaveModalOpen, setAddFarmSaveModalOpen] = useState({
    open: false,
    serialNumber: undefined,
  });
  //QR코드 생성 보여주는 부분
  const [createQrcode, setCreateQrcode] = useState(false);

  //QR 다운로드 모달
  const [qrDownloadModalOpen, setQrDownloadModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // 삭제 모달
  const [deleteModalOpen, setDeleteModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // 전체선택 토글
  const AllCheckBoxToggle = useCallback(() => {
    setIsAllCheckBox((prevIs) => !prevIs);
  }, [isAllCheckBox]);

  // 개별선택 토글
  const OneCheckBoxToggle = useCallback(() => {
    setIsOneCheckBox((prevIs) => !prevIs);
  }, [isOneCheckBox]);

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

  // 농가추가 모달
  const handleAddFarmModalClick = () => {
    if (addFarmModalOpen === true) {
      setAddFarmModalOpen(false);
    } else if (addFarmModalOpen === false) {
      setAddFarmModalOpen(true);
    }
  };

  // 농가목록 데이터
  const [listData, setListData] = useState([
    {
      serial_number: "KN001DS0958",
      farm_id: "PF_0021350",
      farm_name: "하나공정육묘장영농조합법인",
      name: "이형채",
      farm_number: "제 13-부산-2018-06-01",
      address: "전라북도 전주시 완산구 123456454",
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
      status: "OFF",
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
      status: "OFF",
    },
  ]);

  //정렬 토글
  const [isFarmNameAscending, setIsFarmNameAscending] = useState(true);
  const [isStatusAscending, setIsStatusAscending] = useState(true);

  // 농가명 정렬
  const sortByFarmName = useCallback(() => {
    setIsFarmNameAscending(!isFarmNameAscending);
    setIsNameOrderBy((prevIsNameOrderBy) => !prevIsNameOrderBy);
    listData.sort((a, b) => {
      const compareResult = a.farm_name.localeCompare(b.farm_name);
      return isFarmNameAscending ? compareResult : -compareResult;
    });
  }, [isFarmNameAscending, isNameOrderBy]);

  // 상태 정렬
  const sortByStatus = useCallback(() => {
    setIsStatusAscending(!isStatusAscending);
    setIsStateOrderBy((prevIsStateOrderBy) => !prevIsStateOrderBy);
    listData.sort((a, b) => {
      const compareResult = a.status.localeCompare(b.status);
      return isStatusAscending ? compareResult : -compareResult;
    });
  }, [isStatusAscending, isStateOrderBy]);

  // 엑셀 다운로드 버튼
  const handleExcelClick = useCallback(() => {
    alert("엑셀 다운로드 클릭");
  }, []);

  // 농가목록 더보기
  const listMoreView = useCallback(() => {
    alert("더보기 버튼 구현중");
  }, []);

  return (
    <S.Wrap>
      <S.InfoBlock>
        <div className="info-wrap">
          <div className="text-wrap">
            <p className="info-title">전체 농가 목록</p>
            <p className="info-sub">농가 목록 추가, 수정, 삭제, QR코드 관리</p>
          </div>
          <div className="button-wrap">
            <S.ExcelButton onClick={handleExcelClick}>
              <ExcelIcon width={20} height={25} />
              <p>엑셀 내려받기</p>
            </S.ExcelButton>
            <S.AddButton onClick={handleAddFarmModalClick}>
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
            <div className="icon-wrap" onClick={sortByFarmName}>
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
            <div className="icon-wrap" onClick={sortByStatus}>
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
              <div
                className="check-box-one"
                onClick={() => {
                  OneCheckBoxToggle(index);
                }}
              >
                {isOneCheckBox ? (
                  <CheckBoxOn width={24} height={24} />
                ) : (
                  <CheckBoxOff width={24} height={24} />
                )}
              </div>
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
              {data.status === "ON" ? (
                <p className="status-on">{data.status}</p>
              ) : (
                <p className="status-off">{data.status}</p>
              )}
              <div
                className="option-dot"
                onClick={() => {
                  handleOptionModalClick(index, data);
                  setQrDownloadModalOpen({
                    open: false,
                    data: data,
                  });
                  setDeleteModalOpen({
                    open: false,
                    data: data,
                  });
                }}
              >
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
              {index === optionModalOpen.index && (
                <OptionModal
                  optionModalOpen={optionModalOpen}
                  setOptionModalOpen={setOptionModalOpen}
                  qrDownloadModalOpen={qrDownloadModalOpen}
                  setQrDownloadModalOpen={setQrDownloadModalOpen}
                  deleteModalOpen={deleteModalOpen}
                  setDeleteModalOpen={setDeleteModalOpen}
                />
              )}
            </S.ListBlock>
          );
        })}
        <S.ButtonWrap onClick={listMoreView}>
          <S.MoreButton>
            <p>더보기</p>
          </S.MoreButton>
        </S.ButtonWrap>
      </S.ContentList>

      {/* 농가추가 모달 */}
      {addFarmModalOpen && (
        <div className="modal-wrap">
          <AddFarmModal
            setAddFarmModalOpen={setAddFarmModalOpen}
            addFarmSerialNumber={addFarmSerialNumber}
            setAddFarmSerialNumber={setAddFarmSerialNumber}
            createQrcode={createQrcode}
            setCreateQrcode={setCreateQrcode}
            setAddFarmSaveModalOpen={setAddFarmSaveModalOpen}
          />
        </div>
      )}
      {/* 농가추가 step2 모달 */}
      {addFarmSaveModalOpen.open && (
        <div className="modal-wrap">
          <AddFarmSaveModal
            setAddFarmSaveModalOpen={setAddFarmSaveModalOpen}
            addFarmSerialNumber={addFarmSerialNumber}
            addFarmSaveModalOpen={addFarmSaveModalOpen}
            nurseryRegNumber={nurseryRegNumber}
            setNurseryRegNumber={setNurseryRegNumber}
            farmId={farmId}
            setFarmId={setFarmId}
            farmName={farmName}
            setFarmName={setFarmName}
            producerName={producerName}
            setProducerName={setProducerName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            addressData={addressData}
            addressDetailData={addressDetailData}
            setAddressData={setAddressData}
            setAddressDetailData={setAddressDetailData}
            setCreateQrcode={setCreateQrcode}
            setAddFarmSerialNumber={setAddFarmSerialNumber}
          />
        </div>
      )}
      {/* QR 다운로드 모달 */}
      {qrDownloadModalOpen.open && (
        <div className="modal-wrap">
          <QrDownloadModal
            qrDownloadModalOpen={qrDownloadModalOpen}
            setQrDownloadModalOpen={setQrDownloadModalOpen}
            optionModalOpen={optionModalOpen}
          />
        </div>
      )}

      {/* 삭제 모달 */}
      {deleteModalOpen.open && (
        <div className="modal-wrap">
          <DeleteModal setDeleteModalOpen={setDeleteModalOpen} />
        </div>
      )}
    </S.Wrap>
  );
}

export default FarmList;
