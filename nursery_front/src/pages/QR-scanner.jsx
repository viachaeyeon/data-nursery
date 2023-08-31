import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

import useUserInfo from "@hooks/queries/auth/useUserInfo";

import MainLayout from "@components/layout/MainLayout";
import DefaultButton from "@components/common/button/DefaultButton";

import QRCodeImage from "@images/login/img-qrcode.svg";
import { defaultButtonColor } from "@utils/ButtonColor";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 126px 24px 24px 24px;
    overflow-y: auto;

    .welcome-text {
      ${({ theme }) => theme.textStyle.h3Bold};
      color: ${({ theme }) => theme.basic.darkBlue};
    }

    .description-text {
      ${({ theme }) => theme.textStyle.h5Regular};
      color: ${({ theme }) => theme.basic.grey50};
      margin-top: 24px;
      white-space: pre-line;

      span {
        ${({ theme }) => theme.textStyle.h5Bold};
        color: #5899fb;
      }
    }
  `,
  QRCodeImageWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0px;
  `,
};

function QRScannerPage() {
  const [step, setStep] = useState("first");

  const [scanResult, setScanResult] = useState(null);

  //   const onScanSuccess = useCallback((decodedText, decodedResult) => {
  //     // Handle on success condition with the decoded text or result.
  //     console.log(`Scan result: ${decodedText}`, decodedResult);
  //   }, []);

  //   const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  //   html5QrcodeScanner.render(onScanSuccess);

  useEffect(() => {
    if (step === "qrCode") {
      const scanner = new Html5QrcodeScanner("render", {
        fps: 10,
        qrbox: 250,
      });

      const success = (result) => {
        scanner.clear();
        setScanResult(result);
      };

      const error = (err) => {
        console.log(err);
      };

      scanner.render(success, error);
      // scanner.render(onScanSuccess);

      // function onScanSuccess(decodedText, decodedResult) {
      //   // Handle on success condition with the decoded text or result.
      //   console.log(`Scan result: ${decodedText}`, decodedResult);
      // }
    }
  }, [step]);

  // function onScanSuccess(decodedText, decodedResult) {
  //   // Handle on success condition with the decoded text or result.
  //   console.log(`Scan result: ${decodedText}`, decodedResult);
  // }

  // var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  // html5QrcodeScanner.render(onScanSuccess);

  console.log(scanResult);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      // userLogout(router, clearQueries);
    },
  });

  return (
    <>
      {step === "first" && (
        <MainLayout>
          <S.Wrap>
            <p className="welcome-text">환영합니다.</p>
            <p className="description-text">
              {userInfo?.farm_house.name}님의{"\n"}생산량 관리를 시작해볼까요?{"\n"}
              {"\n"}먼저 <span>QR코드를 준비해주세요!</span>
            </p>
            <S.QRCodeImageWrap>
              <QRCodeImage />
            </S.QRCodeImageWrap>
            <DefaultButton
              text={"다음"}
              onClick={() => {
                setStep("qrCode");
              }}
              customStyle={defaultButtonColor}
            />
          </S.Wrap>
        </MainLayout>
      )}
      {/* {step === "qrCode" && <div style={{ width: "500px" }} id="reader"></div>} */}
      {step === "qrCode" &&
        (scanResult ? (
          <div>
            Success : <a href={"http://" + scanResult}>{scanResult}</a>
          </div>
        ) : (
          <div style={{ width: "500px" }} id="reader"></div>
        ))}
    </>
  );
}

export default QRScannerPage;
