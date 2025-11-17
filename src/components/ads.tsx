"use client";

import { useEffect, useRef } from "react";

export function AdsBanner728_90({ className }: { className?: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // 清空旧内容
    banner.innerHTML = "";

    // 插入设置脚本
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : 'd95636bce5dab802dc73920a0dc47859',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    banner.appendChild(configScript);

    // 插入广告脚本
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src =
      "//abateadversity.com/d95636bce5dab802dc73920a0dc47859/invoke.js";
    banner.appendChild(invokeScript);
  }, []);

  return <div className={`${className}`} ref={bannerRef} />;
}

export function AdsNativeBanner({ className }: { className?: string }) {
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // 防止重复注入
    container.innerHTML = "";

    // 插入广告脚本（async + data-cfasync）
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = "//abateadversity.com/ded34c31de1bf3074e2350bf7ea37adb/invoke.js";
    container.appendChild(s);

    // 插入广告占位容器（脚本可能会寻找此 id）
    const div = document.createElement("div");
    div.id = "container-ded34c31de1bf3074e2350bf7ea37adb";
    container.appendChild(div);

    return () => {
      // 清理，避免内存泄漏或重复注入
      container.innerHTML = "";
    };
  }, []);

  return <div className={className} ref={bannerRef} />;
}

export function AdsBanner160_600({ className }: { className?: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // 清空旧内容，防止重复注入
    banner.innerHTML = "";

    // 插入设置脚本（从用户提供的 snippet）
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '5855fc4b8d1b9b27bc94adf6b6c06159',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    `;
    banner.appendChild(configScript);

    // 插入广告脚本
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src =
      "//abateadversity.com/5855fc4b8d1b9b27bc94adf6b6c06159/invoke.js";
    banner.appendChild(invokeScript);

    return () => {
      // 清理，避免内存泄漏或重复注入
      banner.innerHTML = "";
    };
  }, []);

  return <div className={className} ref={bannerRef} />;
}

export function AdsBanner300_250({ className }: { className?: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // 清空旧内容，防止重复注入
    banner.innerHTML = "";

    // 插入设置脚本（从用户提供的 snippet）
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '5855fc4b8d1b9b27bc94adf6b6c06159',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    banner.appendChild(configScript);

    // 插入广告脚本
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src =
      "//abateadversity.com/5855fc4b8d1b9b27bc94adf6b6c06159/invoke.js";
    banner.appendChild(invokeScript);

    return () => {
      // 清理，避免内存泄漏或重复注入
      banner.innerHTML = "";
    };
  }, []);

  return <div className={className} ref={bannerRef} />;
}
