import axios from "axios";

// 개요페이지 : 농가수,작물수,파종기,누적파종량 get
export const getDashboardPlanterStatusAPI = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_END_POINT +
          `/api/admin/planter/dashboard/status`,
          {
            withCredentials: true,
          },
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.status || "농가수,작물수,파종기,누적파종량을 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
    }
  };