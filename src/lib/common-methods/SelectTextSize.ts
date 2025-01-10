import InitData from "@/lib/main-entrance/InitData";

export function selectTextSize() {
  const data = new InitData();
  // 显示文字大小选择面板
  data.setTextSizeOptionStatus();
}

export function setTextBold() {
  const data = new InitData();
  data.setFontBold();
}

export function setTextSize(size: number) {
  const data = new InitData();
  // 设置字体大小
  data.setFontSize(size);
}

export function getTextSize(): string {
  const data = new InitData();
  // 获取字体大小
  const size = data.getFontSize();
  return size === 16 ? "中号" : size ===12?"小号":"大号";
}

export function hiddenTextSizeOptionStatus() {
  const data = new InitData();
  // 隐藏文字大小选择面板
  data.setTextSizeOptionStatus(false);
}

export function hiddenColorPanelStatus() {
  const data = new InitData();
  // 隐藏颜色选择面板
  data.setColorPanelStatus(false);
}
