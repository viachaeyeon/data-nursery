import { ImagePathCheck, NumberFormatting } from "@utils/Formatting";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";

import useUpdateWorkStatus from "@hooks/queries/planter/useWorkStatusUpdate";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import FontSmallDefaultButton from "@components/common/button/FontSmallDefaultButton";
import DefaultModal from "@components/common/modal/DefaultModal";

import { borderButtonColor, purpleButtonColor, whiteButtonColor } from "@utils/ButtonColor";
import NoneIcon from "@images/dashboard/none-icon.svg";
import BoxIcon from "@images/dashboard/icon-box.svg";
import theme from "@src/styles/theme";
import { dashBoardKey, workingWorkInfoKey } from "@utils/query-keys/PlanterQueryKeys";

const S = {
  Wrap: styled.div`
    background-color: ${({ theme }) => theme.basic.whiteGrey};
    margin-bottom: 35px;
    border-radius: 8px;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  `,
  WorkInfo: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left;
    }

    .text-wrap {
      width: calc(100% - 90px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .crop-name {
      ${({ theme }) => theme.textStyle.h5Regular}
    }

    .count-text-wrap {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      max-width: 100%;
    }

    .count-text {
      ${({ theme }) => theme.textStyle.h2BoldThin}
      flex:1;
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey40};
      width: fit-content;
    }

    .seed-quantity-wrap {
      gap: 7px;
      margin-top: 10px;
      align-items: center;
    }

    .seed-quantity-text {
      color: ${({ theme }) => theme.basic.grey50};
      flex: 1;
    }
  `,
  CropImage: styled.div`
    width: 84px;
    height: 84px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      props.isCropImage
        ? css`
            background-color: none;
          `
        : css`
            background-color: #ebebf5;
          `}
  `,
  ButtonWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .row-layout {
      flex-direction: row;
      align-items: center;
    }

    .flex-one {
      flex: 1;
    }

    .flex-two {
      flex: 2;
    }
  `,
};

function WorkContent({ isWorking, workingWorkInfo }) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  const [goWorkInfo, setGoWorkInfo] = useState(false); // 작업정보 클릭 여부
  const [workComplete, setWorkComplete] = useState(false); // 작업완료 클릭 여부

  const [modalOpen, setModalOpen] = useState({
    open: false,
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
    cancelFn: null,
  });

  // 작업 상태 변경 API
  const { mutate: updateWorkStatusMutate } = useUpdateWorkStatus(
    () => {
      // 작업중인 작업 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([workingWorkInfoKey]);

      if (goWorkInfo) {
        router.push(`/work/${workingWorkInfo?.id}`);
        setGoWorkInfo(!goWorkInfo);
      }

      if (workComplete) {
        // 오늘의 대시보드 정보 다시 불러오기 위해 쿼리키 삭제
        invalidateQueries([dashBoardKey]);
        setWorkComplete(!workComplete);
      }
    },
    (error) => {
      alert(error);
    },
  );

  return !!workingWorkInfo ? (
    <S.Wrap>
      <S.WorkInfo>
        <div className="text-wrap">
          <p className="crop-name">{workingWorkInfo?.crop_kind}</p>
          <div className="count-text-wrap">
            <p className="count-text">{NumberFormatting(workingWorkInfo?.planter_work_output)}</p>
            <p className="suffix-text">개</p>
          </div>
          <div className="count-text-wrap seed-quantity-wrap">
            <BoxIcon />
            <p className="suffix-text seed-quantity-text">{workingWorkInfo?.tray_total}공</p>
          </div>
        </div>
        <S.CropImage isCropImage={!!workingWorkInfo?.crop_img}>
          {!!workingWorkInfo?.crop_img ? (
            <Image src={ImagePathCheck(workingWorkInfo?.crop_img)} layout="fill" alt="crop image" />
          ) : (
            <NoneIcon width={25} height={25} fill={"#BCBCD9"} />
          )}
        </S.CropImage>
      </S.WorkInfo>
      <S.ButtonWrap>
        <S.ButtonWrap className="row-layout">
          <div className="flex-one">
            {isWorking ? (
              <FontSmallDefaultButton
                type={"pause"}
                onClick={() => {
                  updateWorkStatusMutate({
                    data: {
                      planter_work_id: workingWorkInfo?.id,
                      status: "PAUSE",
                    },
                  });
                }}
                customStyle={whiteButtonColor}
              />
            ) : (
              <FontSmallDefaultButton
                type={"play"}
                onClick={() => {
                  updateWorkStatusMutate({
                    data: {
                      planter_work_id: workingWorkInfo?.id,
                      status: "WORKING",
                    },
                  });
                }}
                customStyle={purpleButtonColor}
              />
            )}
          </div>
          <div className="flex-two">
            <FontSmallDefaultButton
              text={"작업정보"}
              onClick={() => {
                if (isWorking) {
                  setGoWorkInfo(true);
                  setModalOpen({
                    open: true,
                    title: "작업정보 확인",
                    description: (
                      <>
                        작업상태가 <span>일시정지 상태</span>로{"\n"}변경됩니다. 진행할까요?
                      </>
                    ),
                    btnType: "two",
                    afterFn: () => {
                      updateWorkStatusMutate({
                        data: {
                          planter_work_id: workingWorkInfo?.id,
                          status: "PAUSE",
                        },
                      });
                    },
                    cancelFn: () => {
                      setGoWorkInfo(false);
                    },
                  });
                } else {
                  router.push(`/work/${workingWorkInfo?.id}`);
                }
              }}
              customStyle={whiteButtonColor}
            />
          </div>
        </S.ButtonWrap>
        <FontSmallDefaultButton
          text={"작업완료"}
          onClick={() => {
            setWorkComplete(true);
            setModalOpen({
              open: true,
              type: "success",
              title: "작업완료",
              description: "완료된 작업은 이력조회에서\n확인 할 수 있습니다.",
              btnType: "one",
              afterFn: () => {
                updateWorkStatusMutate({
                  data: {
                    planter_work_id: workingWorkInfo?.id,
                    status: "DONE",
                  },
                });
              },
              cancelFn: null,
            });
          }}
          customStyle={borderButtonColor}
        />
      </S.ButtonWrap>
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </S.Wrap>
  ) : (
    <div className="no-work">
      <NoneIcon width={50} height={50} fill={theme.basic.grey20} />
      <p>진행중인 작업이 없습니다</p>
    </div>
  );
}

export default WorkContent;
