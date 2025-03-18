import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "../components/App";
// import reportWebVitals from "./reportWebVitals";

import { theme } from "../components/ThemeProvider";
import { ThemeProvider } from "@emotion/react";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   // タブ切り替え時にアンマウント→stateリセットの問題を引き起こすのでStrictModeは使わない
//   // <React.StrictMode>
//   <ThemeProvider theme={theme}>
//     <App />
//   </ThemeProvider>
//   // {/* </React.StrictMode> */}
// );

// // // If you want to start measuring performance in your app, pass a function
// // // to log results (for example: reportWebVitals(console.log))
// // // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();

import Head from "next/head";
// import Layout, { siteTitle } from "../components/layout";
// import utilStyles from "../styles/utils.module.css";
// import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import { SwiperTab } from "@/components/SwiperTab";
// import Date from "../components/date";

// 今回は SSG に外部データを必要としないのでコメントアウト
// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData();
//   return {
//     props: {
//       allPostsData,
//     },
//   };
// }

export default function Home() {
  // 現在 SSG 対応のためにコメントアウトしている
  // localStorage や windown などがある状態で SSG したい場合は以下を有効にする

  // const [isClientSide, setIsClientSide] = useState(false);

  // useEffect(() => {
  //   // コンポーネントがクライアントサイドでマウントされたときにフラグを true に設定
  //   setIsClientSide(true);
  // }, []);

  // if (!isClientSide) {
  //   // クライアントサイドでマウントされるまでは何もレンダリングしない、またはプレースホルダーを表示
  //   return null; // またはローディングインジケーターなど
  // }

  // ここまで

  return (
    <>
      <Head>
        <title>Dmax</title>
      </Head>
      {/* <SwiperTab /> */}
      <App />
    </>
  );
}
