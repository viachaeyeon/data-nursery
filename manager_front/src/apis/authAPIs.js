import axios from "axios";

// 통계현황 목록
export const getStatics = async (
  year,
  month,
  dateRange,
  farmHouseId,
  farmHouseName,
  cropName,
  cropKindOrderType,
  trayTotal,
  seedQuantityOrderType,
  planterOutputOrderType,
  sowingDateOrderType,
  isShipmentCompletedOrderType,
  page,
) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/admin/planter/planter-work/statics?year=${year}&month=${month}&date_range=${dateRange}&farm_house_id=${farmHouseId}&farmhouse_name=${farmHouseName}&crop_name=${cropName}&crop_kind_order_type=${cropKindOrderType}&tray_total=${trayTotal}&seed_quantity_order_type=${seedQuantityOrderType}&planter_output_order_type=${planterOutputOrderType}&sowing_date_order_type=${sowingDateOrderType}&is_shipment_completed_order_type=${isShipmentCompletedOrderType}&page=${page}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "통계현황 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 농가ID 목록
export const getFarmHouseIdList = async (searchText) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/search/farm_house_id?search=${searchText}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가ID 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 농가명 목록
export const getFarmHouseNameList = async (searchText) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/search/farmhouse_name?search=${searchText}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가명 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
