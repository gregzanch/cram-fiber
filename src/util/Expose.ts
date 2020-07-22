export function expose(obj) {
  Object.assign(window, obj);
}

export default expose;