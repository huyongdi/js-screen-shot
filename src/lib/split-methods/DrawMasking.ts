import PlugInParameters from "@/lib/main-entrance/PlugInParameters";

/**
 * 绘制蒙层
 * @param context 需要进行绘制canvas
 * @param imgData 屏幕截图canvas容器
 */
export function drawMasking(
  context: CanvasRenderingContext2D,
  imgData?: HTMLCanvasElement
) {
  const data = new PlugInParameters();
  const plugInParameters = new PlugInParameters();
  const canvasSize = plugInParameters.getCanvasSize();
  const viewSize = {
    width: parseFloat(window.getComputedStyle(document.body).width),
    height: parseFloat(window.getComputedStyle(document.body).height)
  };
  const maxWidth = Math.max(
    viewSize.width || 0,
    Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
    Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
    Math.max(document.body.clientWidth, document.documentElement.clientWidth)
  );
  const maxHeight = Math.max(
    viewSize.height || 0,
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
    Math.max(document.body.clientHeight, document.documentElement.clientHeight)
  );
  // 清除画布
  context.clearRect(0, 0, maxWidth, maxHeight);

  // 绘制闪烁边框
  if (plugInParameters.getBlink()) {
    context.lineWidth = 3; // 边框宽度
    context.strokeStyle = "#368FFF"; // 设置边框颜色
    context.strokeRect(0, 0, canvasSize.canvasWidth, canvasSize.canvasHeight); // 绘制边框
    drawMask(context,data,canvasSize,maxWidth,maxHeight)
  }
  setTimeout(() => {
    context.clearRect(0, 0, maxWidth, maxHeight);
    // 屏幕截图存在且展示截图数据的状态为true则进行绘制
    if (imgData != null && plugInParameters.getShowScreenDataStatus()) {
      // 调用者传了画布尺寸则使用，否则使用窗口宽高
      if (canvasSize.canvasWidth !== 0 && canvasSize.canvasHeight !== 0) {
        context.drawImage(
          imgData,
          0,
          0,
          canvasSize.canvasWidth,
          canvasSize.canvasHeight
        );
      } else {
        context.drawImage(imgData, 0, 0, maxWidth, maxHeight);
      }
    }
    context.save();
    drawMask(context, data, canvasSize, maxWidth, maxHeight,2)
    context.restore()
  },100)
}

// 第一步先渲染用户传的蒙层色值，第二步采用明亮色值
const drawMask = (context: CanvasRenderingContext2D,data:any,canvasSize:any,maxWidth:number,maxHeight:number,step=1) => {
  const maskColor = data.getMaskColor();
  context.fillStyle = "rgba(0, 0, 0, .6)";
  if (maskColor) {
    context.fillStyle = step ===1 ?`rgba(${maskColor.r}, ${maskColor.g}, ${maskColor.b}, ${maskColor.a})`:'rgba(0,0,0,.01)';
  }
  if (canvasSize.canvasWidth !== 0 && canvasSize.canvasHeight !== 0) {
    context.fillRect(0, 0, canvasSize.canvasWidth, canvasSize.canvasHeight);
  } else {
    context.fillRect(0, 0, maxWidth, maxHeight);
  }
}
