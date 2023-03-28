import * as React from 'react';
import Head from 'next/head';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';

import { createEmotionCache, theme } from '@/lib/theme';

import qs from 'query-string';
import cweb from '@gswl/cweb';
import { useEffect } from 'react';

cweb.opt.baseURL = 'gswl.lovigame.com:8888/gsworks/';
cweb.opt.base = 'jsonp';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  useEffect(()=>{
    (async ()=>{
      try {
        // const item = localStorage.getItem("__GSDD");
        // if(item){
        //   return;
        // }
        // const authCode = qs.parse(location.search).authCode || "";
        // if(qs.parse(location.search).authCode) {
        //   localStorage.setItem("__GSDD",authCode as string)
        //   location.href = location.origin + (location.pathname || "");
        //   return;
        // }
        const obj = qs.parse(location.search);
        const data = await cweb.request("getAllTags",{...obj});
      } catch (e: any) {
        console.log("E",e)
        if(!e.authUrl){
          return;
        }
        // if (e.error === 'NEED_AUTH') {
          const href = location.href;
          const params = qs.parse(location.search);
          delete params['authCode'];
          delete params['code'];
          let redirectUrl = qs.stringifyUrl({
            url: location.origin + (location.pathname || ""),
            query:params,
          });
        // window.open(e.authUrl + encodeURIComponent(redirectUrl));
          location.href = e.authUrl + encodeURIComponent(redirectUrl);
        // } else {
        //   throw e;
        // }
      }
    })();
  },[])
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <CssVarsProvider defaultMode='light' theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
        <VercelAnalytics debug={false} />
      </CssVarsProvider>
    </CacheProvider>
  );
}
