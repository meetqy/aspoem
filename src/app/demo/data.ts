export type TreeNode = {
  type: "node";
  value: number;
  name: string;
  children: Tree[];
};
export type TreeLeaf = {
  type: "leaf";
  name: string;
  value: number;
};

export type Tree = TreeNode | TreeLeaf;

export const data: Tree = {
  type: "node",
  name: "boss",
  value: 0,
  children: [
    {
      type: "node",
      name: "Team Dataviz",
      value: 0,
      children: [
        { type: "leaf", name: "Mark", value: 90 },
        { type: "leaf", name: "Robert", value: 12 },
        { type: "leaf", name: "Emily", value: 34 },
        { type: "leaf", name: "Marion", value: 53 },
      ],
    },
    {
      type: "node",
      name: "Team DevOps",
      value: 0,
      children: [
        { type: "leaf", name: "Nicolas", value: 98 },
        { type: "leaf", name: "Malki", value: 22 },
        { type: "leaf", name: "Djé", value: 12 },
      ],
    },
    {
      type: "node",
      name: "Team Sales",
      value: 0,
      children: [
        { type: "leaf", name: "Mélanie", value: 45 },
        { type: "leaf", name: "Einstein", value: 76 },
      ],
    },
  ],
};
