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
