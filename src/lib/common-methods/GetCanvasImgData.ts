import { saveCanvasToImage } from "@/lib/common-methods/SaveCanvasToImage";
import { saveCanvasToBase64 } from "@/lib/common-methods/SaveCanvasToBase64";
import InitData from "@/lib/main-entrance/InitData";
import PlugInParameters from "@/lib/main-entrance/PlugInParameters";
// import { redoAll } from "@/lib/common-methods/TakeOutHistory";

/**
 * 将指定区域的canvas转为图片
 */
export function getCanvasImgData(isSave: boolean) {
  const data = new InitData();
  const plugInParameters = new PlugInParameters();
  const screenShotCanvas = data.getScreenShotContainer()?.getContext("2d");
  const screenShotController = data.getScreenShotContainer();
  // 获取裁剪区域位置信息
  const { startX, startY, width, height } = data.getCutOutBoxPosition();
  let base64 = "";

  // 先清空然后再画：避免截图把边界点带进去
  const canvasWidth = screenShotController?.width;
  const canvasHeight = screenShotController?.height;
  // if (screenShotCanvas && canvasWidth && canvasHeight) {
  //   redoAll();
  // }

  if (screenShotCanvas) {
    if (isSave) {
      // 将canvas转为图片
      saveCanvasToImage(screenShotCanvas, startX, startY, width, height);
    } else {
      // 将canvas转为base64
      base64 = saveCanvasToBase64(
        screenShotCanvas,
        startX,
        startY,
        width,
        height,
        0.75,
        plugInParameters.getWriteImgState()
      );
    }
  }
  return base64;
}
