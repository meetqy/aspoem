"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const RightAside = ({ children }: { children: React.ReactNode }) => {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById("right_aside"));
  }, []);

  return container && createPortal(children, container, "right_aside");
};
