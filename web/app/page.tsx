"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const bgMarker = useTransform(scrollYProgress, [0, 0.2], ["#fff", "#00f"]);
  const textMarker = useTransform(scrollYProgress, [0, 0.1], ["#333", "#fff"]);

  return (
    <>
      <motion.section
        className="relative h-screen py-16 w-full"
        ref={targetRef}
      >
        <motion.div className="container max-w-7xl fixed -translate-x-2/1 text-center">
          <h1 className="text-5xl">宿金沙江</h1>
          <p className="text-2xl mt-2 mb-4">明·杨慎</p>
          <div className="text-3xl grid gap-y-4">
            <p>
              <motion.span
                style={{ backgroundColor: bgMarker, color: textMarker }}
              >
                往年
              </motion.span>
              曾向嘉陵宿，驿楼东畔阑干曲。
            </p>
            <p>江声彻夜搅离愁，月色中天照幽独。</p>
            <p>岂意飘零瘴海头，嘉陵回首转悠悠。</p>
            <p>江声月色那堪说，肠断金沙万里楼。</p>
          </div>
        </motion.div>
      </motion.section>

      <div style={{ height: 3000 }}>213</div>
    </>
  );
}
