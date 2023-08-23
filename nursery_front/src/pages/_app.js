import React from "react";
import { ThemeProvider } from "styled-components";
import SSRProvider from "react-bootstrap/SSRProvider";
import BootstrapThemeProvider from "react-bootstrap/ThemeProvider";
import GlobalStyle from "@src/styles/globalStyle";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

import "@public/static/fonts/fontStyle.css";
import theme from "@src/styles/theme";

export default function App({ Component, pageProps }) {
  return (
    <SSRProvider>
      <BootstrapThemeProvider lang="en" breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Head>
            <title>농가용</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </BootstrapThemeProvider>
    </SSRProvider>
  );
}
