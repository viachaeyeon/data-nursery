import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
// import { useMediaQuery } from "react-responsive";
import styled, { css } from "styled-components";
import Image from "next/image";

import theme from "@src/styles/theme";
import BackIcon from "@images/common/arrow-left.svg";
import MoreIcon from "@images/common/more-icon.svg";
import MyInfoIcon from "@images/common/my-info-icon.svg";
// import BottomBackgrounImage from "@images/common/bottom-background-image.svg";

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

    width: 456px;
    height: 843px;

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
    background-color: #ffffff;

    svg {
      cursor: pointer;
    }

    p {
      width: calc(100% - 72px);

      ${({ theme }) => theme.textStyle.h3Bold}
      color: ${({ theme }) => theme.basic.grey60};

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
  BottomWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    bottom: 0px;
  `,
  BottomBackgroundImage: styled.div`
    bottom: 0px;
    position: absolute;

    background-image: url("/images/common/bottom-background-image.svg");
    width: 100%;
    height: 88px;
    /* right: calc(50% - 233px); */
    bottom: 0px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 25% 50%;
    flex: 1;
  `,
};

// pageName : 헤더에서 나타낼 페이지이름, 아무값도 넘겨주지 않으면 헤더 비활성화
// isBackIcon : 헤더에서 뒤로가기 아이콘 표시 유무
// backIconClickFn : 뒤로가기 아이콘 클릭 시 실행되는 함수
// isMoreIcon : 헤더에서 ... 표시 유무
// buttonType : 페이지 하단 버튼에 하나의 버튼 표시시 "one", 2개의 버튼 표시시 "two", 아무값도 넘겨주지 않으면 하단 버튼 비활성화
// mainBackgroundColor : 메인콘텐츠의 배경 색상 (메인화면의 하단 버튼의 radius의 뒷 배경 색 변경 위해 필요)
function MainLayout({ children, pageName, isBackIcon = true, backIconClickFn, isMoreIcon = false, buttonType }) {
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

  // const isMobile = useMediaQuery({
  //   query: `(max-width: ${theme.contentWidths.mobile})`,
  // });
  const [mainContentHeight, setMainContentHeight] = useState("100%");

  // 헤더 및 하단 버튼 유무에 따라 내부 콘텐츠 height 지정
  useEffect(() => {
    // if (!!pageName && !!buttonType) {
    //     setMainContentHeight("calc(100% - 178px)");
    // } else
    if (!!pageName) {
      setMainContentHeight("calc(100% - 72px)");
    }
    // else if (!!buttonType) {
    //   setMainContentHeight(`calc(100% - 104px)`);
    // }
    else {
      setMainContentHeight("100%");
    }
  }, [pageName, buttonType]);

  return (
    <S.Wrap>
      <S.MainLayout isMain={pageName === "main"}>
        <S.MainContent height={mainContentHeight}>
          {pageName === "main" && (
            <S.PageNameWrap className="main-page-name">
              <div className="text-wrap">
                <p className="date-text">{today[0] + today[1] + today[2].replace(".", " ") + today[3]}</p>
                <p className="logo-text">Data Nursery</p>
              </div>
              <MyInfoIcon
                onClick={() => {
                  alert("준비중입니다.");
                }}
              />
            </S.PageNameWrap>
          )}
          {!!pageName && pageName !== "main" && (
            <S.PageNameWrap isBackIcon={isBackIcon} isMoreIcon={isMoreIcon}>
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
          {pageName === "main" && (
            <S.BottomWrap>
              {/* <DefaultButton
                  customStyle={buttonSetting.color}
                  text={buttonSetting.text}
                  onClick={buttonSetting.onClickEvent}
                /> */}
              {/* <BottomBackgrounImage className="bottom-background" /> */}
              <S.BottomBackgroundImage>
                {/* <Image src={"/images/common/bottom-background-image.svg"} layout="fill" alt="menu image" /> */}
              </S.BottomBackgroundImage>
            </S.BottomWrap>
          )}
        </S.MainContent>
      </S.MainLayout>
    </S.Wrap>
  );
}

export default MainLayout;
