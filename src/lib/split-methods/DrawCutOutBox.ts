import PlugInParameters from "@/lib/main-entrance/PlugInParameters";

const lineWidth = 2
let overPoints: any[] = [];
const offscreenCanvas = document.createElement('canvas');
const offscreenContext = offscreenCanvas.getContext('2d');
offscreenCanvas.id = "offscreenCanvas";
offscreenCanvas.style.position = "fixed";
offscreenCanvas.style.zIndex = "100000";
offscreenCanvas.style.pointerEvents = "none"

// 绘制裁剪框的八个原点
export const drawPoint = (
  strokeColor: string,
  fillColor: string,
  borderSize: number,
  addWidth: number
) => {
  if (!offscreenContext) return
  const { width, height } = offscreenCanvas;
  // 设定圆点的半径
  const radius = borderSize / 2;

  // 设定外框的颜色和宽度
  offscreenContext.lineWidth = lineWidth;  // 外框宽度，可以根据需求调整
  offscreenContext.strokeStyle = strokeColor;  // 外框颜色为蓝色

  // 设定内框的填充颜色为白色
  offscreenContext.fillStyle = fillColor;

  // 绘制8个圆点: 顺时针从左上角开始
  const points = [
    [addWidth / 2, addWidth / 2],
    [width / 2, addWidth / 2],
    [width-addWidth/2, addWidth / 2],

    [width-addWidth/2, height / 2],

    [width-addWidth/2, height - addWidth/2],
    [width / 2, height - addWidth/2],
    [addWidth / 2, height - addWidth/2],

    [addWidth / 2, height / 2]
  ];

  // 遍历每个点，绘制圆
  points.forEach(([x, y]) => {
    offscreenContext.beginPath();
    offscreenContext.arc(x , y, radius, 0, Math.PI * 2); // 绘制圆，调整圆心位置
    offscreenContext.fill();  // 填充白色
    offscreenContext.stroke();  // 绘制蓝色边框
  })

  overPoints = points.map(([x, y]) => ({x, y, radius}));
};

/**
 * 绘制裁剪框
 * @param mouseX 鼠标x轴坐标
 * @param mouseY 鼠标y轴坐标
 * @param width 裁剪框宽度
 * @param height 裁剪框高度
 * @param context 需要进行绘制的canvas画布
 * @param borderSize 边框节点直径
 * @param controller 需要进行操作的canvas容器
 * @param imageController 图片canvas容器
 * @param drawBorders
 * @private
 */

export function drawCutOutBox(
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
  context: CanvasRenderingContext2D,
  borderSize: number,
  controller: HTMLCanvasElement,
  imageController: HTMLCanvasElement,
  drawBorders = true
) {
  // 获取画布宽高
  const canvasWidth = controller?.width;
  const canvasHeight = controller?.height;
  const dpr = window.devicePixelRatio || 1;
  const data = new PlugInParameters();

  // 画布、图片不存在则return
  if (!canvasWidth || !canvasHeight || !imageController || !controller) return;

  // 清除画布
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  width = width != 0 ? width : 5;
  height = height != 0 ? height : 5;

  // 绘制蒙层
  context.save();
  const maskColor = data.getMaskColor();
  context.fillStyle = "rgba(0, 0, 0, .6)";
  if (maskColor) {
    context.fillStyle = `rgba(${maskColor.r}, ${maskColor.g}, ${maskColor.b}, ${maskColor.a})`;
  }
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  // 将蒙层凿开
  context.globalCompositeOperation = "source-atop";
  // 裁剪选择框
  context.clearRect(mouseX, mouseY, width, height);
  // 绘制8个边框像素点并保存坐标信息以及事件参数
  context.globalCompositeOperation = "source-over";
  context.fillStyle = data.getCutBoxBdColor();
  // 是否绘制裁剪框的8个像素点
  if (drawBorders) {
    const addWidth = borderSize + lineWidth
    offscreenCanvas.width = width + addWidth;
    offscreenCanvas.height = height + addWidth;
    offscreenCanvas.style.left =
      parseFloat(controller.style.left) + mouseX - addWidth / 2 + "px";
    offscreenCanvas.style.top = parseFloat(controller.style.top) + mouseY -addWidth/2 + 'px';

    drawPoint(
      "#368FFF",
      "white",
      borderSize,
      addWidth
    );
    document.body.appendChild(offscreenCanvas)
    // context.drawImage(offscreenCanvas, 0, 0)
  }
  // 绘制结束
  context.restore();
  // 使用drawImage将图片绘制到蒙层下方
  context.save();

  context.globalCompositeOperation = "destination-over";
  // 图片尺寸使用canvas容器的css中的尺寸
  let {imgWidth, imgHeight} = {
    imgWidth: parseInt(controller?.style.width),
    imgHeight: parseInt(controller?.style.height)
  };

  // 用户有传入截图dom绘制时使用其dom的尺寸
  const screenShotDom = data.getScreenShotDom();
  if (screenShotDom != null) {
    imgWidth = screenShotDom.clientWidth;
    imgHeight = screenShotDom.clientHeight;
  }

  // 用户有传入自定义尺寸则使用
  if (data.getCustomImgSize().useCustomImgSize) {
    const {w, h} = data.getCustomImgSize().customImgSize;
    imgWidth = w;
    imgHeight = h;
  }

  // 非webrtc模式、未开启图片自适应、未自定义图片尺寸、未传入截图dom时，图片的宽高不做处理
  if (
    !data.getWebRtcStatus() &&
    !data.getImgAutoFit() &&
    !data.getCustomImgSize().useCustomImgSize &&
    screenShotDom == null
  ) {
    imgWidth = imageController.width / dpr;
    imgHeight = imageController.height / dpr;
  }

  context.drawImage(imageController, 0, 0, imgWidth, imgHeight);
  context.restore();
  // 返回裁剪框临时位置信息
  if (width > 0 && height > 0) {
    // 考虑左上往右下拉区域的情况
    return {
      startX: mouseX,
      startY: mouseY,
      width: width,
      height: height
    };
  } else if (width < 0 && height < 0) {
    // 考虑右下往左上拉区域的情况
    return {
      startX: mouseX + width,
      startY: mouseY + height,
      width: Math.abs(width),
      height: Math.abs(height)
    };
  } else if (width > 0 && height < 0) {
    // 考虑左下往右上拉区域的情况
    return {
      startX: mouseX,
      startY: mouseY + height,
      width: width,
      height: Math.abs(height)
    };
  } else if (width < 0 && height > 0) {
    // 考虑右上往左下拉区域的情况
    return {
      startX: mouseX + width,
      startY: mouseY,
      width: Math.abs(width),
      height: height
    };
  }
  return {
    startX: mouseX,
    startY: mouseY,
    width: width,
    height: height
  };
}

