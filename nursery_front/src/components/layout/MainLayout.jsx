import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { useMediaQuery } from "react-responsive";
import styled, { css } from "styled-components";

import theme from "@src/styles/theme";
import BackIcon from "@images/common/arrow-left.svg";
import MoreIcon from "@images/common/more-icon.svg";

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
      padding: 26px 16px 16px 16px;
    }

    .content {
      height: ${(props) => props.height};
    }

    ${({ theme }) => theme.media.max_mobile} {
      width: 100%;
      height: 100%;
      margin: 0px;
      border-radius: 0px;

      .main-page-name {
        padding: 16px;
      }
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
    gap: 8px;
    position: sticky;
    bottom: 0px;
    box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px 16px 0px 0px;
    padding: 24px 16px;
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
          {pageName === "main" && <S.PageNameWrap className="main-page-name"></S.PageNameWrap>}
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
          {/* <S.BottomWrap>
              <DefaultButton
                  customStyle={buttonSetting.color}
                  text={buttonSetting.text}
                  onClick={buttonSetting.onClickEvent}
                />
            </S.BottomWrap> */}
        </S.MainContent>
      </S.MainLayout>
    </S.Wrap>
  );
}

export default MainLayout;
