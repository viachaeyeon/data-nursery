import axios from "axios";

// 개요페이지 : 농가수,작물수,파종기,누적파종량 get
export const getDashboardPlanterStatusAPI = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/admin/planter/dashboard/status`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.status || "농가수,작물수,파종기,누적파종량을 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.",
    );
  }
};

// 개요페이지 : 총 생산량 조회
export const getDashboardTotalAPI = async (queryType) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/planter/total-output?query_type=${queryType}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.status || "총 생산량을 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//개요페이지 : 작물별 생산량 조회
export const getDashboardCropTotalAPI = async (queryType) => {
    try { 
        const res = await axios.get(
            process.env.NEXT_PUBLIC_END_POINT + `/api/admin/planter/crop/total-output?query_type=${queryType}`,
            {
                withCredentials: true,
              },
            );
            return res.data;
          } catch (err) {
            throw new Error(err.response?.status || "작물별 생산량을 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
          }
        };