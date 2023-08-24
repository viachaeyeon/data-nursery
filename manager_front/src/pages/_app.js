import GlobalStyle from "@src/styles/globalStyle";
import Head from "next/head";


export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Data Nursery</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
