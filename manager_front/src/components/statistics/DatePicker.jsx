import React, { useState } from "react";
import styled from "styled-components";

import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

const S = {
  Wrap: styled.div`
    .date-picker {
      height: 36px;
      padding: 6px 12px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};
      background-color: ${({ theme }) => theme.blackWhite.white};
      border-radius: 8px;

      .react-daterange-picker__wrapper {
        border: none;
      }
    }
  `,
};

function DatePicer() {
  const [value, onChange] = useState([new Date(), new Date()]);

  return (
    <S.Wrap>
      <DateRangePicker
        onChange={onChange}
        value={value}
        className="date-picker"
      />
    </S.Wrap>
  );
}

export default DatePicer;
