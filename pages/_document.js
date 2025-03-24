import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import { DocumentHeadTags, documentGetInitialProps } from "@mui/material-nextjs/v14-pagesRouter";
import theme from "../src/theme";
import { getInitColorSchemeScript } from "@mui/material";

export default function MyDocument(props) {
  const description =
    "MHWildsの自動ダメージ最大化シミュレーターです。モンスターごとに最大ダメージを出す装備構成を自動で見つけてくれます。";

  return (
    <Html lang="en">
      <Head>
        {/* favicon */}
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax/images/favicon.webp`}
        />
        {/* Open Graph Tags */}
        <meta property="og:title" content="DMAX" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax/images/favicon.webp`}
        />
        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@sample" />
        <meta name="twitter:title" content="DMAX" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax/images/favicon.webp`}
        />
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.vars.palette.primary.main} />
        <meta name="emotion-insertion-point" content="" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        {getInitColorSchemeScript()}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
