import axios from "axios";

export const registerPlanter = async (data) => {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_END_POINT + `/api/planter/farmhouse/register?serial_number=${data.serial_number}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "파종기를 등록하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 트레이 목록
export const getTrayListAPI = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/tray/list`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "트레이 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
