import axios from "axios";

export const loginAPI = (data) => {
  return axios.post(process.env.NEXT_PUBLIC_END_POINT + "/api/auth/login", data, { withCredentials: true });
};

export const getUserInfo = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/common/user`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "유저 정보를 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가목록
export const getAllFarmListAPI = async (nameOrder, statusOrder, page, size) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/auth/farmhouse/list?name_order=${nameOrder}&status_order=${statusOrder}&page=${page}&size=${size}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.status || "전체 농가 목록을 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
