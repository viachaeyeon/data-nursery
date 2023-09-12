import React, { useState, useCallback } from "react";
import styled from "styled-components";

// import DatePickerMain from "./DatePickerMain";
import { YYYYMMDDSlash } from "@src/utils/Formatting";

import { NumberCommaFormatting } from "@src/utils/Formatting";

import ExcelIcon from "@images/management/excel-icon.svg";
import UpArrow from "@images/common/order-by-up-icon.svg";
import DownArrow from "@images/common/order-by-down-icon.svg";
import FinCheckIcon from "@images/statistics/fin-check-icon.svg";
import WaitingIcon from "@images/statistics/waiting-icon.svg";
import GrayFinCheckIcon from "@images/statistics/gray-fin-check-icon.svg";
import GrayWaitingIcon from "@images/statistics/gray-waiting-icon.svg";
import HeaderSelectArrowIcon from "@images/statistics/header-icon-arrow.svg";
import SelectArrowIcon from "@images/statistics/icon-arrow.svg";
import PickerIcon from "@images/statistics/date-picker-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import SearchIcon from "@images/statistics/icon-search.svg";

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
      display: flex;
      justify-content: center;
    }
  `,
  InfoBlock: styled.div`
    background-color: #fff;
    padding: 32px 56px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

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

    .sub-wrap {
      display: flex;
      align-items: center;
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
  DateChooseWrap: styled.div`
    display: flex;
    gap: 8px;
    margin-top: 13px;
  `,
  YearDropDown: styled.div`
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 6px 16px;
    width: 138px;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,
  MonthDropDown: styled.div`
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 6px 16px;
    width: 120px;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,
  HeaderDropDown: styled.div`
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: #f7f7f9;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 6px 6px 16px;
    select {
      cursor: pointer;
      -webkit-appearance: none;
      border: none;
      outline: none;
      width: 100%;
      background-color: #f7f7f9;
    }

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,

  ContentList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    .list-table-head {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 6px 32px 6px 24px;
      min-width: 1500px;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .search-select-modal-wrap {
        position: relative;
      }

      .no {
        width: 42px;
      }
      .farm-name {
        width: 125px;
      }

      .order-count {
        width: 115px;
      }
      .sowing {
        width: 115px;
      }
      .state {
        width: 98px;
      }
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

    .delete {
      border: 1px solid ${({ theme }) => theme.basic.whiteGray};
      box-shadow: none;

      p {
        color: #c6c6c6;
        ${({ theme }) => theme.textStyle.h7Bold};
      }

      .farm-name-frist {
        background-color: #c6c6c6;
      }
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
      display: flex;
      align-items: center;
    }

    .list_id {
      /* width: 36px; */
      width: 42px;
      justify-content: center;
    }
    .farm_id {
      width: 168px;
      justify-content: center;
    }
    .farm_name {
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .farm_plant {
      width: 100px;
      justify-content: start;
    }
    .plant_name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 109px;
      justify-content: start;
    }
    .tray {
      width: 24px;
      justify-content: center;
    }
    .order_count {
      width: 115px;
      justify-content: end;
    }
    .sowing_count {
      width: 126px;
      justify-content: end;
      color: ${({ theme }) => theme.basic.deepBlue};
      ${({ theme }) => theme.textStyle.h7Bold};
    }
    .sowing_date {
      width: 126px;
      justify-content: center;
      color: ${({ theme }) => theme.basic.gray40};
      ${({ theme }) => theme.textStyle.h7Semibold}
    }

    .farm_name_wrap {
      display: flex;
      gap: 8px;
      /* align-items: center; */
      width: 224px;
      justify-content: start;
    }

    .farm-name-frist {
      background-color: #79cec8;
      border-radius: 30px;
      padding: 8px;
      color: #fff;
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
  EmptyData: styled.div`
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
  ClickPicker: styled.div`
    padding: 6px 12px 6px 16px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.blackWhite.white};
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 248px;
    height: 36px;
    cursor: pointer;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler}
    }
  `,
  YearDropDownList: styled.div`
    position: absolute;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    height: 300px;
    top: 247px;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    width: 138px;
    overflow-y: auto;

    .drop-down-list {
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: start;
      cursor: pointer;
      background-color: ${({ theme }) => theme.basic.whiteGray};

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
      }
    }
    .drop-down-list:hover {
      background-color: ${({ theme }) => theme.basic.gray20};
      border-radius: 4px;
    }
  `,
  MonthDropDownList: styled.div`
    position: absolute;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    height: 300px;
    top: 247px;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    width: 138px;
    overflow-y: auto;
    left: 542px;

    .drop-down-list {
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: start;
      cursor: pointer;
      background-color: ${({ theme }) => theme.basic.whiteGray};

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
      }
    }
    .drop-down-list:hover {
      background-color: ${({ theme }) => theme.basic.gray20};
      border-radius: 4px;
    }
  `,

  SearchSelectBox: styled.div`
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    background-color: #f7f7f9;
    padding: 6px 6px 6px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  DotBorder: styled.div`
    border: 1px dashed ${({ theme }) => theme.basic.recOutline};
    height: 1px;
    width: 100%;
  `,
  Dropdown: styled.div`
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.basic.whiteGray};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    position: absolute;
    top: 36px;

    .input-wrap {
      border-radius: 4px;
      padding: 6px 8px 6px 12px;
      height: 30px;
      background-color: ${({ theme }) => theme.blackWhite.white};
      display: flex;
      gap: 6px;
      align-items: center;

      input {
        border: none;
        width: 100%;
      }
      input:focus-visible {
        outline: none;
      }
      input::placeholder {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
      }
    }
    .drop-down-list-wrap {
      max-height: 272px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;

      p {
        display: flex;
        align-items: center;
        justify-content: start;
      }
    }
    .drop-down-list {
      display: flex;
      padding: 4px;
      gap: 8px;
      border-radius: 4px;
      align-items: center;

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .drop-down-list:hover {
      background-color: ${({ theme }) => theme.basic.gray20};
    }
  `,
};

function StatisticsStatus() {
  const [plantName, setPlantName] = useState(true);
  const [orderCount, setOrderCount] = useState(true);
  const [sowingCount, setSowingCount] = useState(true);
  const [sowingDate, setSowingDate] = useState(true);
  const [state, setState] = useState(true);

  // 선택된 연도
  const [selectYear, setSelectYear] = useState("");
  //선택된 월
  const [selectMonth, setSelectMonth] = useState("");

  //연도별 drop down 모달 오픈
  const [yearModalOpen, setYearModalOpen] = useState(false);

  //월별 drop down 모달 오픈
  const [monthModalOpen, setMonthModalOpen] = useState(false);

  //달력 모달 오픈
  const [pickerOpen, setPickerOpen] = useState(false);

  //농가 id 드롭다운 모달 오픈
  const [isFarmId, setIsFarmId] = useState(false);

  //농가명 드롭다운 모달 오픈
  const [isFarmName, setIsFarmName] = useState(false);

  //작물명 드롭다운 모달 오픈
  const [isCropsName, setIsCropsName] = useState(false);

  //트레이 드롭다운 모달 오픈
  const [isTrayCount, setIsTrayCount] = useState(false);

  // 연도별 클릭시
  const handelYearDropDown = useCallback(() => {
    if (yearModalOpen) {
      setYearModalOpen(false);
    } else {
      setYearModalOpen(true);
      setMonthModalOpen(false);
      setIsFarmId(false);
      setIsFarmName(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [yearModalOpen, monthModalOpen, isFarmId, isFarmName, isCropsName, isTrayCount]);

  //월별 클릭시
  const handelMonthDropDown = useCallback(() => {
    if (monthModalOpen) {
      setMonthModalOpen(false);
    } else {
      setMonthModalOpen(true);
      setYearModalOpen(false);
      setIsFarmId(false);
      setIsFarmName(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [monthModalOpen, yearModalOpen, isCropsName, isFarmId, isFarmName, isTrayCount]);

  //연도별 drop down 내용 클릭
  const handleClickYearDropList = useCallback(
    (data) => {
      setSelectYear(data);
      setYearModalOpen(false);
    },
    [selectYear, yearModalOpen],
  );

  //월별 drop down 내용 클릭
  const handleClickMonthDropList = useCallback(
    (data) => {
      setSelectMonth(data);
      setMonthModalOpen(false);
    },
    [selectMonth, monthModalOpen],
  );

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  //달력 클릭
  const handlePickerClick = useCallback(() => {
    setPickerOpen(true);
    setYearModalOpen(false);
    setMonthModalOpen(false);
    setIsFarmId(false);
    setIsFarmName(false);
    setIsCropsName(false);
    setIsTrayCount(false);
  }, [pickerOpen, yearModalOpen, monthModalOpen, isFarmId, isFarmName, isCropsName, isTrayCount]);

  // 농가 id 드롭다운 클릭
  const handleFarmIdClick = useCallback(() => {
    if (isFarmId) {
      setIsFarmId(false);
    } else {
      setIsFarmId(true);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmName(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [isFarmId, yearModalOpen, monthModalOpen, isFarmName, isCropsName, isTrayCount]);

  // 농가명 드롭다운 클릭
  const handleFarmNameClick = useCallback(() => {
    if (isFarmName) {
      setIsFarmName(false);
    } else {
      setIsFarmName(true);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmId(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [isFarmName, yearModalOpen, monthModalOpen, isFarmId, isCropsName, isTrayCount]);

  // 작물명 드롭다운 클릭
  const handleCropsNameClick = useCallback(() => {
    if (isCropsName) {
      setIsCropsName(false);
    } else {
      setIsCropsName(true);
      setIsFarmName(false);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmId(false);
      setIsTrayCount(false);
    }
  }, [isFarmName, yearModalOpen, monthModalOpen, isFarmId, isCropsName, isTrayCount]);

  // 트레이 드롭다운 클릭
  const handleTrayCountClick = useCallback(() => {
    if (isTrayCount) {
      setIsTrayCount(false);
    } else {
      setIsTrayCount(true);
      setIsCropsName(false);
      setIsFarmName(false);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmId(false);
    }
  }, [isFarmName, yearModalOpen, monthModalOpen, isFarmId, isCropsName, isTrayCount, isTrayCount]);

  //정렬 토글
  const [isFarmNameAscending, setIsFarmNameAscending] = useState(true);
  const [isStatusAscending, setIsStatusAscending] = useState(true);

  // 품종명 정렬
  const sortByFarmName = useCallback(() => {
    setIsFarmNameAscending(!isFarmNameAscending);
    setPlantName((prevPlantName) => !prevPlantName);
    listData.sort((a, b) => {
      const compareResult = a.plant_name.localeCompare(b.plant_name);
      return isFarmNameAscending ? compareResult : -compareResult;
    });
  }, [isFarmNameAscending, plantName]);

  // 주문수량 정렬
  const sortByStatus = useCallback(() => {
    setIsStatusAscending(!isStatusAscending);
    setOrderCount((prevOrderCount) => !prevOrderCount);
    listData.sort((a, b) => {
      const compareResult = a.order_count.localeCompare(b.order_count);
      return isStatusAscending ? compareResult : -compareResult;
    });
  }, [isStatusAscending, orderCount]);

  // 파종량 정렬
  const sortBySowingCount = useCallback(() => {
    setIsStatusAscending(!isStatusAscending);
    setSowingCount((prevSowingCount) => !prevSowingCount);
    listData.sort((a, b) => {
      const compareResult = a.sowing_count.localeCompare(b.sowing_count);
      return isStatusAscending ? compareResult : -compareResult;
    });
  }, [isStatusAscending, sowingCount]);

  // 파종일자
  const sortBySowingDate = useCallback(() => {
    setIsStatusAscending(!isStatusAscending);
    setSowingDate((prevSowingDate) => !prevSowingDate);
    listData.sort((a, b) => {
      const compareResult = a.sowingDate.localeCompare(b.sowingDate);
      return isStatusAscending ? compareResult : -compareResult;
    });
  }, [isStatusAscending, sowingDate]);

  // 출하상태
  const sortByState = useCallback(() => {
    setIsStatusAscending(!isStatusAscending);
    setState((prevState) => !prevState);
    listData.sort((a, b) => {
      const compareResult = a.state.localeCompare(b.state);
      return isStatusAscending ? compareResult : -compareResult;
    });
  }, [isStatusAscending, state]);

  const listMoreView = useCallback(() => {
    alert("더보기 버튼 구현중");
  }, []);

  // 농가목록 데이터
  const [listData, setListData] = useState([
    {
      id: 1,
      serial_number: "KN001DS0958",
      farm_id: "PF_0021350",
      farm_name: "하나공정육묘장영농조합법인",
      farm_plant: "토마토",
      plant_name: "송이토마토토마토",
      tray: "128",
      order_count: "94581999",
      sowing_count: "9999999",
      sowingDate: "2023/08/16",
      state: "fin",
      farm_delete: "0", //0이 삭제되지 않은것 1이 삭제된것
    },
    {
      id: 2,
      serial_number: "KN001DS0958 ",
      farm_id: "PF_0021350",
      farm_name: "가야프러그영농조합",
      farm_plant: "고추",
      plant_name: "고추고추",
      tray: "18",
      order_count: "99999999",
      sowing_count: "1122399",
      sowingDate: "2023/08/15",
      state: "wait",
      farm_delete: "0",
    },
    {
      id: 3,
      serial_number: "KN001DS0958 ",
      farm_id: "PF_0021350",
      farm_name: "가야프러그영농조합",
      farm_plant: "고추",
      plant_name: "고추고추",
      tray: "18",
      order_count: "99999999",
      sowing_count: "1122399",
      sowingDate: "2023/08/15",
      state: "wait",
      farm_delete: "1",
    },
    {
      id: 4,
      serial_number: "KN001DS0958 ",
      farm_id: "PF_0021350",
      farm_name: "가야프러그영농조합",
      farm_plant: "고추",
      plant_name: "고추고추",
      tray: "18",
      order_count: "99999999",
      sowing_count: "1122399",
      sowingDate: "2023/08/15",
      state: "fin",
      farm_delete: "1",
    },
  ]);

  //연도 데이터
  const yearList = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
  //월 데이터
  const monthList = ["1", "2", "3", "1", "2", "3", "1", "2", "3"];

  //농가 ID 데이터
  const farmIdList = [
    "PF_0021350",
    "PF_0021351",
    "PF_0021352",
    "PF_0021352",
    "PF_0021353",
    "PF_0021354",
    "PF_0021355",
    "PF_0021356",
    "PF_0021350",
    "PF_0021351",
    "PF_0021352",
    "PF_0021352",
    "PF_0021353",
    "PF_0021354",
    "PF_0021355",
    "PF_0021356",
  ];

  //농가명 데이터
  const farmNameList = [
    "하나공정육묘장영농조합법인dddddd",
    "김해고송육묘",
    "보천육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
    "대곡제일육묘장",
  ];

  //작물명 데이터
  const cropsName = [
    "토마토",
    "수박",
    "오이",
    "고추",
    "상추",
    "복숭아",
    "마늘",
    "당근",
    "고추",
    "상추",
    "복숭아",
    "마늘",
    "당근",
  ];

  //트레이 데이터
  const trayCount = ["128", "64", "128", "64", "128", "64", "128", "64", "128", "64", "128", "64", "128", "64"];

  return (
    <S.Wrap>
      <S.InfoBlock>
        <div className="block-inner">
          <div className="info-wrap">
            <div className="text-wrap">
              <p className="info-title">통계현황</p>
              <div className="sub-wrap">
                <p className="info-sub">통계보기 및 검색 (</p>
                <UpArrow width={15} height={15} />
                <p className="info-sub">정렬기능 )</p>
              </div>
              {listData.length !== 0 && (
                <>
                  <S.DateChooseWrap>
                    <S.YearDropDown onClick={handelYearDropDown}>
                      <p>연도별</p>
                      <SelectArrowIcon width={24} height={24} />
                    </S.YearDropDown>
                    <S.MonthDropDown onClick={handelMonthDropDown}>
                      <p>월별</p>
                      <SelectArrowIcon width={24} height={24} />
                    </S.MonthDropDown>
                    {startDate === null || endDate === null ? (
                      <S.ClickPicker onClick={handlePickerClick}>
                        <p>직접선택</p>
                        <PickerIcon width={19} height={19} />
                      </S.ClickPicker>
                    ) : (
                      <S.ClickPicker onClick={handlePickerClick}>
                        <p>
                          {YYYYMMDDSlash(startDate)} ~ {YYYYMMDDSlash(endDate)}
                        </p>
                        <PickerIcon width={19} height={19} />
                      </S.ClickPicker>
                    )}
                  </S.DateChooseWrap>
                  {yearModalOpen && (
                    <S.YearDropDownList>
                      {yearList.map((data, index) => {
                        return (
                          <div
                            className="drop-down-list"
                            onClick={() => handleClickYearDropList(data)}
                            key={`map${index}`}>
                            <p>{data}</p>
                          </div>
                        );
                      })}
                    </S.YearDropDownList>
                  )}

                  {monthModalOpen && (
                    <S.MonthDropDownList>
                      {monthList.map((data, index) => {
                        return (
                          <div
                            className="drop-down-list"
                            onClick={() => handleClickMonthDropList(data)}
                            key={`map${index}`}>
                            <p>{data}</p>
                          </div>
                        );
                      })}
                    </S.MonthDropDownList>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          {/* {listData.length !== 0 && (
            <div className="button-wrap">
              <S.ExcelButton>
                <ExcelIcon width={20} height={25} />
                <p>엑셀 내려받기</p>
              </S.ExcelButton>
            </div>
          )} */}
        </div>
      </S.InfoBlock>
      <S.ContentList>
        {listData.length === 0 ? (
          <S.EmptyData>
            <img src="/images/statistics/w-icon-graph.png" alt="statistics-icon" />
            <p>등록된 통계현황이 없습니다.</p>
          </S.EmptyData>
        ) : (
          <>
            <div className="list-table-head">
              <p className="no">NO</p>

              <div className="search-select-modal-wrap">
                <S.HeaderDropDown style={{ width: "168px" }} onClick={handleFarmIdClick}>
                  <p>농가 ID</p>
                  <HeaderSelectArrowIcon width={20} height={20} />
                </S.HeaderDropDown>

                {isFarmId && (
                  <S.Dropdown style={{ width: "168px" }}>
                    <div className="input-wrap">
                      <SearchIcon width={18} height={18} />
                      <input placeholder="검색어 입력" />
                    </div>
                    <S.DotBorder />
                    <div className="drop-down-list-wrap">
                      {farmIdList.map((data, index) => {
                        return (
                          <div className="drop-down-list" key={`farmId${index}`}>
                            <CheckBoxOff width={24} height={24} />
                            <p style={{ width: "120px" }}>{data}</p>
                          </div>
                        );
                      })}
                    </div>
                  </S.Dropdown>
                )}
              </div>

              <div className="search-select-modal-wrap">
                <S.HeaderDropDown style={{ width: "224px" }} onClick={handleFarmNameClick}>
                  <p>농가명</p>
                  <HeaderSelectArrowIcon width={20} height={20} />
                </S.HeaderDropDown>
                {isFarmName && (
                  <S.Dropdown style={{ width: "224px" }}>
                    <div className="input-wrap">
                      <SearchIcon width={18} height={18} />
                      <input placeholder="검색어 입력" />
                    </div>
                    <S.DotBorder />
                    <div className="drop-down-list-wrap">
                      {farmNameList.map((data, index) => {
                        return (
                          <div className="drop-down-list" key={`farmName${index}`}>
                            <CheckBoxOff width={24} height={24} />
                            <p style={{ width: "120px" }}>{data}</p>
                          </div>
                        );
                      })}
                    </div>
                  </S.Dropdown>
                )}
              </div>

              <div className="search-select-modal-wrap">
                <S.HeaderDropDown style={{ width: "154px" }} onClick={handleCropsNameClick}>
                  <p>작물명</p>
                  <HeaderSelectArrowIcon width={20} height={20} />
                </S.HeaderDropDown>

                {isCropsName && (
                  <S.Dropdown style={{ width: "154px", height: "270px" }}>
                    <div className="input-wrap">
                      <SearchIcon width={18} height={18} />
                      <input placeholder="검색어 입력" />
                    </div>
                    <S.DotBorder />
                    <div className="drop-down-list-wrap">
                      {cropsName.map((data, index) => {
                        return (
                          <div className="drop-down-list" key={`cropsName${index}`}>
                            <CheckBoxOff width={24} height={24} />
                            <p style={{ width: "120px" }}>{data}</p>
                          </div>
                        );
                      })}
                    </div>
                  </S.Dropdown>
                )}
              </div>

              <div className="arrow-wrap farm-name">
                <p>품종명</p>
                <div className="icon-wrap" onClick={sortByFarmName}>
                  {plantName ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>

              <div className="search-select-modal-wrap">
                <S.HeaderDropDown style={{ width: "154px" }} onClick={handleTrayCountClick}>
                  <p>트레이</p>
                  <HeaderSelectArrowIcon width={20} height={20} />
                </S.HeaderDropDown>
                {isTrayCount && (
                  <S.Dropdown style={{ width: "154px", height: "350px" }}>
                    <div className="input-wrap">
                      <SearchIcon width={18} height={18} />
                      <input placeholder="검색어 입력" />
                    </div>
                    <S.DotBorder />
                    <div className="drop-down-list-wrap">
                      {trayCount.map((data, index) => {
                        return (
                          <div className="drop-down-list" key={`trayCount${index}`}>
                            <CheckBoxOff width={24} height={24} />
                            <p style={{ width: "120px" }}>{data}</p>
                          </div>
                        );
                      })}
                    </div>
                  </S.Dropdown>
                )}
              </div>

              <div className="arrow-wrap order-count">
                <p>주문수량</p>
                <div className="icon-wrap" onClick={sortByStatus}>
                  {orderCount ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>
              <div className="arrow-wrap sowing">
                <p>파종량</p>
                <div className="icon-wrap" onClick={sortBySowingCount}>
                  {sowingCount ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>
              <div className="arrow-wrap sowing">
                <p>파종일자</p>
                <div className="icon-wrap" onClick={sortBySowingDate}>
                  {sowingDate ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>
              <div className="arrow-wrap state">
                <p>출하상태</p>
                <div className="icon-wrap" onClick={sortByState}>
                  {state ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>
            </div>

            {listData.map((data, index) => {
              return (
                <S.ListBlock key={`map${index}`} className={data.farm_delete === "1" && "delete"}>
                  <p className="list_id">{data.id}</p>
                  <p className="farm_id">{data.farm_id}</p>
                  <div className="farm_name_wrap">
                    <div className="farm-name-frist">{data.farm_name.slice(0, 1)}</div>
                    <p className="farm_name">{data.farm_name}</p>
                  </div>
                  <p className="farm_plant">{data.farm_plant}</p>
                  <p className="plant_name">{data.plant_name}</p>
                  <p className="tray">{data.tray}</p>
                  <p className="order_count">{NumberCommaFormatting(data.order_count)}</p>
                  <p className="sowing_count">{NumberCommaFormatting(data.sowing_count)}</p>
                  <p className="sowing_date">{data.sowingDate}</p>
                  {data.state === "fin" && data.farm_delete === "0" ? (
                    <FinCheckIcon width={98} height={40} />
                  ) : data.state === "wait" && data.farm_delete === "0" ? (
                    <WaitingIcon width={98} height={40} />
                  ) : data.state === "fin" && data.farm_delete === "1" ? (
                    <GrayFinCheckIcon width={98} height={40} />
                  ) : data.state === "wait" && data.farm_delete === "1" ? (
                    <GrayWaitingIcon width={98} height={40} />
                  ) : (
                    <></>
                  )}
                </S.ListBlock>
              );
            })}
          </>
        )}
        {listData.length !== 0 && (
          <S.ButtonWrap>
            <S.MoreButton onClick={listMoreView}>
              <p>더보기</p>
            </S.MoreButton>
          </S.ButtonWrap>
        )}
      </S.ContentList>

      {/* {pickerOpen && (
        <div className="modal-wrap">
          <DatePickerMain
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
            setDateRange={setDateRange}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )} */}
    </S.Wrap>
  );
}

export default StatisticsStatus;
