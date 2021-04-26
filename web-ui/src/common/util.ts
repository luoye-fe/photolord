export default null;

/**
 * 根据 main container 的高度，获取 item 的适当高度
 * 默认将 容器 高度分成 7 份
 */
export function getItemSuitableHeight() {
  let itemHeight = 100;
  const partCount = 6;
  const minHeight = 120;
  const maxHeight = 180;
  const mainContainerEl = document.querySelector('body');

  if (!mainContainerEl) return itemHeight;

  const containerHeight = getComputedStyle(mainContainerEl).height;
  itemHeight = Math.floor(parseInt(containerHeight, 10) / partCount);

  if (itemHeight < minHeight) return minHeight;
  if (itemHeight > maxHeight) return maxHeight;
    
  return itemHeight;
}
