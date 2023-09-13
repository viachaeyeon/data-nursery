import axios from "axios";

// 트레이 총 홀 수 목록
export const getTrayTotalList = async (searchText) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/planter/search/planter-tray-total?search=${searchText}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.status || "트레이 총 홀 수 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.",
    );
  }
};
