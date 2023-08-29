import React, { useState, useEffect } from "react";
import styled from "styled-components";

import MainLayout from "@components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";
import FarmList from "@components/management/FarmList";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
  `,
};

// 현재날짜 + 시간
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// 현재날짜
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function Dashboard() {
  // 현재시간
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
      setCurrentDate(getCurrentDate());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(intervalId);
  }, []);

  return (
    <MainLayout>
      {/* <MainHeader currentDateTime={currentDateTime} /> */}
      <S.Wrap>
        <FarmList />
      </S.Wrap>
    </MainLayout>
  );
}

export default Dashboard;
