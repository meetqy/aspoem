"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import ScrollToTop from "../_components/ScrollToTop";

export default function Loading() {
  // 简写 loading text => lt
  const params = useSearchParams();
  const title = params.get("lt") ?? "Let's Go !";

  return (
    <>
      <ScrollToTop />

      <div className="flex h-full w-full items-center justify-center uppercase">
        <motion.div className="text-center">
          {title.split("").map((item, index) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{
                opacity: 100,
              }}
              transition={{ delay: index * 0.025 }}
              className="text-stroke-base-100 text-9xl"
              key={index}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </>
  );
}
