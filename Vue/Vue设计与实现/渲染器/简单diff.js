function patchChildren(n1, n2, container) {
  if (typeof n2.children === "string") {
  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children;
    const newChildren = n2.children;

    // 记录寻找节点在 oldVNode 中的最大索引值，用于判断可复用节点是否需要移动，当 index < lastIndex 时，VNode的真实节点就需要移动
    let lastIndex = 0;
    for (let i = 0; i < newChildren.length; i++) {
      for (let j = 0; j < oldChildren.length; j++) {}
    }
  }
}
