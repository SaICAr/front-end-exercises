// 返回 VNode
export function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}

// 根据 VNode 创建真实 DOM，并挂载
// 创建 tag Node
// 添加 props
// 递归挂载 content
export function mount(vnode, container) {
  // 创建目标节点
  // 将真实 DOM 保存在 VNode 的 el 属性中，这一步是为了建立 VNode <=> DOM 关系，在 patch 的时候能够获取到 VNode 对应的 真实DOM
  const el = (vnode.el = document.createElement(vnode.tag));

  // 添加 props，props 有以下几种情况
  // attribute/props/event
  if (vnode.props) {
    for (let key of Object.keys(vnode.props)) {
      const value = vnode.props[key];
      if (key.startsWith("on")) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  // 挂载
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    }

    if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        mount(child, el);
      });
    }
  }

  container.appendChild(el);
}

// patch 对比新旧 DOM 差异，对修改部分进行更新
export function patch(n1, n2) {
  if (n1.tag === n2.tag) {
    // 获取真实DOM
    const el = (n2.el = n1.el);

    // 比较 props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};

    // 遍历 newProps
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];

      // 如果存在该属性，值不同就进行替换
      if (oldValue !== newValue) {
        el.setAttribute(key, newValue);
      }
    }

    // 遍历 oldProps
    for (const key in oldProps) {
      // 如果 newProps 没有该属性，则删除
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    // 比较 children
    const oldChildren = n1.children;
    const newChildren = n2.children;
    // newChildren 为 string 的情况
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (oldChildren !== newChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.textContent = newChildren;
      }
    } else {
      // oldChildren => string，newChildren => array，content 挂载新 node
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChildren.forEach((child) => {
          mount(child, el);
        });
      } else {
        /**
         * 新旧 Children 都为 array 的时候，就需要通过 diff 算法（双端 diff、快速 diff）去比较两者的差异
         * 这里先用简单 diff：
         * - 首先找出相同的长度段（Math.min(newChildren.length, oldChildren.length），并比较其中的差异
         * - 接着判断剩余部分的归属
         * -- 如果剩余部分是新的（newChildren.length > oldChildren.length），那么直接挂载
         * -- 如果是剩余部分是旧的（newChildren.length < oldChildren.length），那么就卸载
         */
        const commonLength = Math.min(oldChildren.length, newChildren.length);
        for (let i = 0; i < commonLength; i++) {
          // 比较公共部分的差异
          patch(oldChildren[i], newChildren[i]);
        }

        // 判断非公共部分
        if (oldChildren.length < newChildren.length) {
          newChildren.slice(commonLength).forEach((child) => {
            mount(child, el);
          });
        } else if (oldChildren.length > newChildren.length) {
          oldChildren.slice(commonLength).forEach((child) => {
            el.removeChild(child.el);
          });
        }
      }
    }
  } else {
    // tag 不一样，直接替换
    const parentNode = n1.el.parentNode;
    parentNode.removeChild(n1.el);

    mount(n2, parentNode);
  }
}
