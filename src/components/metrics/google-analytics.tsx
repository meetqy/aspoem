"use client";

import Script from "next/script";

const GoogleAnalytics = ({ id }: { id?: string }) => {
  if (!id) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${id}');
                    `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
