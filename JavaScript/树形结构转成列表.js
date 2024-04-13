const data = [
  {
    id: 1,
    text: "节点1",
    parentId: 0,
    children: [
      {
        id: 2,
        text: "节点1_1",
        parentId: 1,
      },
    ],
  },
  {
    id: 3,
    text: "节点2",
    parentId: 0,
  },
];

function treeToList(tree) {
  const res = [];

  const dfs = (data) => {
    data.forEach((i) => {
      const { id, text, parentId } = i;
      res.push({
        id,
        text,
        parentId,
      });
      if (i.children) {
        dfs(i.children);
      }
    });
  };

  dfs(tree);
  return res;
}

console.log(treeToList(data));
