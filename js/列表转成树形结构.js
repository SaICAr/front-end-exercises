const list = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
  { id: 6, name: "部门6", pid: 0 },
];

const listToTree = (list) => {
  const tree = [];

  list.forEach((i) => {
    const children = list.filter((j) => j.pid === i.id);
    if (children.length) {
      i.children = children;
    }

    // 顶层节点
    if (i.pid === 0) {
      tree.push(i);
    }
  });

  return tree;
};

console.log(JSON.stringify(listToTree(list)));
