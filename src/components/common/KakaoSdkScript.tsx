'use client'

import Script from 'next/script'

interface KakaoSdkScriptProps {
    javascriptKey: string;
}

export default function KakaoSdkScript({
    javascriptKey,
}: KakaoSdkScriptProps) {
    return (
        <Script
            id="kakao-sdk"
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
            strategy="afterInteractive"
            onLoad={() => {
                if (
                    javascriptKey &&
                    window.Kakao &&
                    !window.Kakao.isInitialized()
                ) {
                    window.Kakao.init(javascriptKey);
                }
            }}
        />
    );
}
