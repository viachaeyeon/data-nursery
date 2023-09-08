import GlobalStyle from "@src/styles/globalStyle";
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import theme from "@src/styles/theme";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Head>
        <title>Data Nursery</title>
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
