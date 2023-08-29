import React, { useCallback, useState } from "react";
import styled from "styled-components";

import DaumPostcode from "react-daum-postcode";

import XIcon from "@images/common/icon-x.svg";
import SearchIcon from "@images/management/search-btn.svg";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 616px;
    max-height: 100vh;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px;
    display: flex;
    flex-direction: column;

    .address-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .search {
      cursor: pointer;
    }

    .postmodal {
      background: rgba(0, 0, 0, 0.25);
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .sub-title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold}
    }
    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }

    .x-icon {
      cursor: pointer;
    }
  `,
  InputWrap: styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .input-wrap-off {
      width: 100%;
      background-color: ${({ theme }) => theme.blackWhite.white};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.lightSky};

      input {
        background-color: ${({ theme }) => theme.blackWhite.white};
        border: 1px solid ${({ theme }) => theme.blackWhite.white};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Bold};
      }
    }
    .input-wrap {
      width: 100%;
      background-color: ${({ theme }) => theme.basic.lightSky};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.lightSky};

      input {
        background-color: ${({ theme }) => theme.basic.lightSky};
        border: 1px solid ${({ theme }) => theme.basic.lightSky};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Bold};
      }
      input::placeholder {
        color: ${({ theme }) => theme.basic.gray50};
        ${({ theme }) => theme.textStyle.h6Reguler}
      }
      input:focus-visible {
        outline: none;
      }
    }

    .title-info {
      margin-top: 8px;
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold}
    }
  `,
  ButtonWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.primery.primery};
    border-radius: 8px;
    padding: 16px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    cursor: pointer;

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
  ButtonWrapOff: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

    p {
      color: ${({ theme }) => theme.basic.gray30};
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
};

function AddFarmSaveModal({
  addFarmSerialNumber,
  addFarmSaveModalOpen,
  nurseryRegNumber,
  setNurseryRegNumber,
  farmId,
  setFarmId,
  farmName,
  setFarmName,
  producerName,
  setProducerName,
  phoneNumber,
  setPhoneNumber,
  addressData,
  addressDetailData,
  setAddressDetailData,
  setAddFarmSaveModalOpen,
  setCreateQrcode,
  setAddFarmSerialNumber,
}) {
  console.log("addFarmSaveModalOpen", addFarmSaveModalOpen);

  const closeModal = useCallback(() => {
    setAddFarmSaveModalOpen({ open: false, serialNumber: undefined });
    setCreateQrcode(false);
    setAddFarmSerialNumber("");
  }, []);

  const FarmInfoSave = useCallback(() => {
    if (
      nurseryRegNumber.length === 0 ||
      farmId.length === 0 ||
      farmName.length === 0 ||
      producerName.length === 0 ||
      phoneNumber.length === 0 ||
      addressData.length === 0 ||
      setAddressDetailData === 0
    ) {
      alert("정보를 입력해주세요.");
      return;
    }
  }, [
    nurseryRegNumber,
    farmId,
    farmName,
    producerName,
    phoneNumber,
    addressData,
    setAddressDetailData,
  ]);

  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddressClick = (data) => {
    setAddress(data.address);
    setIsModalOpen(false);
  };

  // const handleAddressClick = useCallback(() => {

  //   // const complete = (data) =>{
  //     // let fullAddress = data.address;
  //     // let extraAddress = '';

  //     // if (data.addressType === 'R') {
  //     //     if (data.bname !== '') {
  //     //         extraAddress += data.bname;
  //     //     }
  //     //     if (data.buildingName !== '') {
  //     //         extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
  //     //     }
  //     //     fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
  //     // }
  //     // console.log(data)
  //     // console.log(fullAddress)
  //     // console.log(data.zonecode)

  //     // props.setcompany({
  //     //     ...props.company,
  //     //     address:fullAddress,
  //     // })
  // }

  // }, []);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="sub-title">STEP 2</p>
            <p className="title">농가추가</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <p className="title-info">파종기 시러얼번호</p>
          <div className="input-wrap-off">
            <input value={addFarmSerialNumber} disabled />
          </div>
          <p className="title-info">육묘업 등록번호</p>
          <div className="input-wrap">
            <input
              placeholder="예) 제88-지역-2023-08-09"
              value={nurseryRegNumber}
              onChange={(e) => setNurseryRegNumber(e.target.value)}
            />
          </div>
          <p className="title-info">농가ID</p>
          <div className="input-wrap">
            <input
              placeholder="예) PF_0021350"
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
            />
          </div>
          <p className="title-info">농가명</p>
          <div className="input-wrap">
            <input
              placeholder="사업장명을 입력하세요."
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
            />
          </div>
          <p className="title-info">생산자명</p>
          <div className="input-wrap">
            <input
              placeholder="이름을 입력하세요."
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
            />
          </div>
          <p className="title-info">연락처</p>
          <div className="input-wrap">
            <input
              placeholder="연락처를 입력하세요."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <p className="title-info">주소</p>
          <div className="address-wrap">
            <div className="input-wrap">
              <input
                placeholder="주소를 입력하세요."
                value={addressData}
                disabled
              />
              <div className="search" onClick={() => setIsModalOpen(true)}>
                <SearchIcon width={40} height={40} />
              </div>
            </div>
            <div className="input-wrap">
              <input
                placeholder="나머지 주소를 입력하세요."
                value={addressDetailData}
                onChange={(e) => setAddressDetailData(e.target.value)}
              />
            </div>
          </div>
        </S.InputWrap>
        {isModalOpen && (
          <DaumPostcode onComplete={handleAddressClick} autoClose={true} />
        )}
        {/* <DaumPostcode
                className="postmodal"
                autoClose
                onComplete={complete} /> */}
        {/* <div onComplete={handleComplete} className="post-code" /> */}
        <S.ButtonWrap onClick={FarmInfoSave}>
          <p>저장</p>
        </S.ButtonWrap>
      </S.WrapInner>
    </S.Wrap>
  );
}

export default AddFarmSaveModal;
