/* eslint-disable */
import { useMemo } from "react";
import { type Tree } from "./data";
import * as d3 from "d3";
import styles from "./treemap.module.css";

type TreemapProps = {
  width: number;
  height: number;
  data: Tree;
};

const colors = [
  "#e0ac2b",
  "#6689c6",
  "#a4c969",
  "#e85252",
  "#9a6fb0",
  "#a53253",
  "#7f7f7f",
];

export const Treemap = ({ width, height, data }: TreemapProps) => {
  const hierarchy = useMemo(() => {
    return d3.hierarchy<Tree>(data).sum((d) => d.value as number);
  }, [data]);

  // List of item of level 1 (just under root) & related color scale
  const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(firstLevelGroups || [])
    .range(colors);

  const root = useMemo(() => {
    const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
    return treeGenerator(hierarchy);
  }, [hierarchy, width, height]);

  const allShapes = root.leaves().map((leaf, i) => {
    const parentName = leaf.parent?.data.name;
    return (
      <g key={i} className={styles.rectangle}>
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          stroke="transparent"
          fill={parentName && colorScale(parentName)}
          className={"opacity-80 hover:opacity-100"}
        />
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 3}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="text-xl"
        >
          {leaf.data.name}
        </text>
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 18}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="font-light"
        >
          {leaf.data.value}
        </text>
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height} className={styles.container}>
        {allShapes}
      </svg>
    </div>
  );
};
