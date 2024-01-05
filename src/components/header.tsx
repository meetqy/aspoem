"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const HeaderMain = ({ children }: { children: React.ReactNode }) => {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById("header_main"));
  }, []);

  return container && createPortal(children, container, "header_main");
};
