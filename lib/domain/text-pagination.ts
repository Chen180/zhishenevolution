export interface TextBlock {
  text: string;
  /** 段落在排版容器中的实际渲染高度（px），由调用方测量后传入 */
  height: number;
}

/**
 * 把原始文案切分为段落：按换行拆分，去掉首尾空白，过滤空段。
 */
export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * 贪心装箱：按顺序把段落装入高度不超过 pageHeight 的页面。
 * 单个段落超过 pageHeight 时独占一页（渲染层需自行处理溢出）。
 */
export function paginateBlocks(
  blocks: TextBlock[],
  pageHeight: number,
): TextBlock[][] {
  if (pageHeight <= 0) {
    throw new Error("pageHeight must be positive");
  }

  const pages: TextBlock[][] = [];
  let currentPage: TextBlock[] = [];
  let currentHeight = 0;

  for (const block of blocks) {
    if (block.height > pageHeight) {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
      pages.push([block]);
      continue;
    }

    if (currentHeight + block.height > pageHeight && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(block);
    currentHeight += block.height;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
