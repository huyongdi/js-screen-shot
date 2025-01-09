/**
 * 取出一条历史记录
 */
import InitData from "@/lib/main-entrance/InitData";

export function takeOutHistory() {
  const data = new InitData();
  data.popHistory();
  const screenShortCanvas = data.getScreenShotContainer()?.getContext("2d");
  if (screenShortCanvas != null) {
    if (data.getHistory().length > 0) {
      screenShortCanvas.putImageData(
        data.getHistory()[data.getHistory().length - 1]["data"],
        0,
        0
      );
    }
  }

  data.setUndoClickNum(data.getUndoClickNum() + 1);
  // 历史记录已取完，禁用撤回按钮点击
  console.log('qqq-undo',data.getHistory().length)
  if (data.getHistory().length -1<= 0) {
    data.setUndoClickNum(0);
    data.setUndoStatus(false);
  }
  // 撤销的同时，需要判断恢复按钮是否可以点击了
  console.log('qqqredo',data.getRedo().length)
  if (data.getRedo().length === 0) {
    data.setRedoStatus(false);
  } else {
    data.setRedoStatus(true);
  }
}

export function takeOutRedo() {
  const data = new InitData();
  data.popRedo();
  const screenShortCanvas = data.getScreenShotContainer()?.getContext("2d");
  if (screenShortCanvas != null) {
    if (data.getHistory().length > 0) {
      screenShortCanvas.putImageData(
        data.getHistory()[data.getHistory().length - 1]["data"],
        0,
        0
      );
    }
  }

  // 恢复栈已取完，禁用恢复点击
  if (data.getRedo().length === 0) {
    data.setRedoStatus(false);
  }
  // 恢复的同时需要判断撤销是否可以点击了
  if (data.getHistory().length === 0) {
    data.setUndoClickNum(0);
    data.setUndoStatus(false);
  } else {
    data.setUndoStatus(true);
  }
}
