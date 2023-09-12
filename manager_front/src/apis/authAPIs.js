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

//농가관리 페이지 : 농가추가
export const addFarmhouseAPI = async (data) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/farmhouse/create`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가를 추가하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가수정
export const updateFarmhouseAPI = async (data) => {
  try {
    const res = await axios.patch(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/farmhouse/update`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가를 수정하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가삭제
export const deleteFarmhouseAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT + `/api/auth/farmhouse/delete?farmhouse_id=${data.farmhouseId}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가를 삭제하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//설정 페이지 : 관리자 추가
export const addAdminAPI = async (data) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/admin/create`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "관리자를 추가하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//설정 페이지 : 관리자 목록
export const getAdminListAPI = async (page,size) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/admin/user/list?page=${page}&size=${size}`,{
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "관리자 리스트를 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};