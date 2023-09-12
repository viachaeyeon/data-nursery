import axios from "axios";

// 통계현황 목록
export const getStatics = async (
  year,
  month,
  day,
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
        `/api/admin/planter/planter-work/statics?year=${year}&month=${month}&day=${day}&farm_house_id=${farmHouseId}&farmhouse_name=${farmHouseName}&crop_name=${cropName}&crop_kind_order_type=${cropKindOrderType}&tray_total=${trayTotal}&seed_quantity_order_type=${seedQuantityOrderType}&planter_output_order_type=${planterOutputOrderType}&sowing_date_order_type=${sowingDateOrderType}&is_shipment_completed_order_type=${isShipmentCompletedOrderType}&page=${page}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.status || "통계현황 정보를 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
