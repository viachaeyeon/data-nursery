const media = {
  max_tablet: "@media screen and (max-width: 1280px)",
  min_tablet: "@media screen and (min-width: 1280px)",
  max_mobile: "@media screen and (max-width: 900px)",
  min_mobile: "@media screen and (min-width: 900px)",
};

const contentWidths = {
  mobile: "900px",
};

const headerHeights = {
  desktop: "124px",
  mobile: "59px",
  mobile_title: "118px",
  tablet: "103px",
};

const textStyle = {
  h1Bold: "font-weight: 700; font-size: 32px; line-height: 28px;",
  h1BoldThin: "font-weight: 700; font-size: 32px; line-height: 28px; letter-spacing: -0.36px;",
  h2Bold: "font-weight: 700; font-size: 28px; line-height: 28px;",
  h2BoldThin: "font-weight: 700; font-size: 28px; line-height: 28px; letter-spacing: -0.36px;",
  h3Bold: "font-weight: 700; font-size: 24px; line-height: 28px;",
  h3Regular: "font-weight: 400; font-size: 24px; line-height: 28px;",
  h4Bold: "font-weight: 700; font-size: 22px; line-height: 26px;",
  h5Bold: "font-weight: 700; font-size: 20px; line-height: 24px;",
  h5Regular: "font-weight: 400; font-size: 20px; line-height: 24px;",
  h6Bold: "font-weight: 700; font-size: 18px; line-height: 20px;",
  h6Regular: "font-weight: 400; font-size: 18px; line-height: 24px;",
  h7Bold: "font-weight: 700; font-size: 16px; line-height: 18px;",
  h7Regular: "font-weight: 400; font-size: 16px; line-height: 18px;",
  h8Regular: "font-weight: 400; font-size: 14px; line-height: 16px;",
  h9Regular: "font-weight: 400; font-size: 12px; line-height: 10.1px; letter-spacing: -2%; paragraph-spacing: 10.14px",
};

const basic = {
  whiteGrey: "#F7F7FA",
  lightSky: "#F0F5FC",
  recOutline: "#DCDCF0",
  grey20: "#F0F0F5",
  grey30: "#C2D6E1",
  grey40: "#929FA6",
  grey50: "#737F8F",
  grey60: "#4F5B6C",
  darkBlue: "#405F8D",
  deepBlue: "#16335F",
  secondary: "#7B97A3",
  warning: "#FF7C8C",
  positive: "#00B071",
  btnAction: "#357AE1",
};

const mobile = {
  inputOutline: "#B0CDF4",
  dashboardFont: "#D8CEFF",
  sky: "#C0D9FF",
  secondary: "#97CDFF",
  secondary2: "#8D78E2",
  btnPress: "#664DCC",
  scrollBar: "#BFCAD9",
};

const theme = {
  media,
  contentWidths,
  headerHeights,
  textStyle,
  basic,
  mobile,
};

export default theme;
