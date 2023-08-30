import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";

import BottomBar from "@components/layout/BottomBar";

import BackIcon from "@images/common/arrow-left.svg";
import MoreIcon from "@images/common/more-icon.svg";
import MyInfoIcon from "@images/common/my-info-icon.svg";
import theme from "@src/styles/theme";

const S = {
  Wrap: styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
  `,
  MainLayout: styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 360px;
    max-height: 843px;
    height: 100%;

    border: 1px solid ${({ theme }) => theme.mobile.inputOutline};

    ${({ theme }) => theme.media.max_mobile} {
      width: 100%;

      ${(props) =>
        props.isMain
          ? css`
              height: 100%;
            `
          : css`
              height: 100vh;
            `}
    }
  `,
  MainContent: styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    .main-page-name {
      padding: 16px 24px 0px 24px;
      align-items: flex-start;
    }

    .content {
      height: ${(props) => props.height};
    }
  `,
  PageNameWrap: styled.div`
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0px;
    padding: 16px 24px;
    z-index: 99;
    background-color: ${(props) => props.backgroundColor};

    svg {
      cursor: pointer;
      fill: ${(props) => (props.backgroundColor === "#ffffff" ? "#929FA6" : "#ffffff")};
    }

    p {
      width: calc(100% - 72px);

      ${({ theme }) => theme.textStyle.h3Bold}
      color: ${(props) => (props.backgroundColor === "#ffffff" ? theme.basic.grey60 : "#ffffff")};

      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 1px;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .date-text {
      width: fit-content;
      ${({ theme }) => theme.textStyle.h7Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }

    .logo-text {
      width: fit-content;
      color: #4b86dd;
      font-family: Ubuntu;
      font-size: 24.804px;
      font-weight: 700;
      letter-spacing: -0.496px;
      margin-top: 1px;
    }

    ${(props) =>
      props.isBackIcon
        ? css`
            .back-icon-wrap {
              visibility: visible;
            }
          `
        : css`
            .back-icon-wrap {
              visibility: hidden;
            }
          `}
    ${(props) =>
      props.isMoreIcon
        ? css`
            .more-icon-wrap {
              visibility: visible;
            }
          `
        : css`
            .more-icon-wrap {
              visibility: hidden;
            }
          `}
  `,
};

// pageName : 헤더에서 나타낼 페이지이름, 아무값도 넘겨주지 않으면 헤더 비활성화
// isBackIcon : 헤더에서 뒤로가기 아이콘 표시 유무
// backIconClickFn : 뒤로가기 아이콘 클릭 시 실행되는 함수
// isMoreIcon : 헤더에서 ... 표시 유무
// backgroundColor : 헤더 배경 색상
function MainLayout({
  children,
  pageName,
  isBackIcon = true,
  backIconClickFn,
  isMoreIcon = false,
  backgroundColor = "#ffffff",
}) {
  const router = useRouter();

  // 오늘 날짜
  const today = useMemo(() => {
    const date = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      timeZone: "Asia/Seoul",
      calendar: "korean",
    };

    return new Intl.DateTimeFormat("ko-KR", options).format(date).split(" ");
  }, []);

  const [mainContentHeight, setMainContentHeight] = useState("100%");

  // 헤더 및 바텀바 유무에 따라 내부 콘텐츠 height 지정
  useEffect(() => {
    if (pageName === "main") {
      setMainContentHeight("calc(100% - 160px)");
    } else if (!!pageName) {
      setMainContentHeight("calc(100% - 72px)");
    } else {
      setMainContentHeight("100%");
    }
  }, [pageName]);

  return (
    <S.Wrap>
      <S.MainLayout isMain={pageName === "main"}>
        <S.MainContent height={mainContentHeight}>
          {pageName === "main" && (
            <S.PageNameWrap className="main-page-name" backgroundColor={backgroundColor}>
              <div className="text-wrap">
                <p className="date-text">{today[0] + today[1] + today[2].replace(".", " ") + today[3]}</p>
                <p className="logo-text">Data Nursery</p>
              </div>
              <MyInfoIcon
                onClick={() => {
                  router.push("/nursery-information");
                }}
              />
            </S.PageNameWrap>
          )}
          {!!pageName && pageName !== "main" && (
            <S.PageNameWrap isBackIcon={isBackIcon} isMoreIcon={isMoreIcon} backgroundColor={backgroundColor}>
              <BackIcon className="back-icon-wrap" onClick={backIconClickFn} />
              <p>{pageName}</p>
              <MoreIcon
                className="more-icon-wrap"
                onClick={() => {
                  router.push("/");
                }}
              />
            </S.PageNameWrap>
          )}
          <div className="content">{children}</div>
          {pageName === "main" && <BottomBar />}
        </S.MainContent>
      </S.MainLayout>
    </S.Wrap>
  );
}

export default MainLayout;
