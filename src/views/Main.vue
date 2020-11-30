<template>
  <div class="main">
    <div class="pg-panel">
      <div
        class="pg-canvas"
        id="pg-canvas"
        :style="{ width: pgCanvas.width, height: pgCanvas.height }"
      >
        <img class="pg-transformable-img" :src="userImg" />
        <div
          class="pg-transformable-control"
          :style="{ width: pgControl.width, height: pgControl.height }"
          id="pg-handle-main"
          ref="controlMain"
        >
          <div class="pg-handle pg-handle-drag" id="pg-handle-drag"></div>
          <div
            class="pg-handle pg-handle-scale-lt"
            id="pg-handle-scale-lt"
          ></div>
          <div
            class="pg-handle pg-handle-scale-lb"
            id="pg-handle-scale-lb"
          ></div>
          <div
            class="pg-handle pg-handle-scale-rt"
            id="pg-handle-scale-rt"
          ></div>
          <div
            class="pg-handle pg-handle-scale-rb"
            id="pg-handle-scale-rb"
          ></div>
        </div>
        <img class="pg-overlay-img" ref="overlayImg" :src="currentImgSrc" />
      </div>
    </div>
    <div class="pg-action">
      <input
        type="file"
        class="hiddenInput"
        accept="image/*"
        @change="handleFiles"
        ref="uploadElem"
      />
      <button class="btn btn-primary" @click="uploadOnClick">上传图片</button>
      <button class="btn btn-success" @click="downloadOnClick">下载截图</button>
    </div>
    <div class="pg-overlay-imgs-selector">
      <div class="container">
        <div
          :class="['img-wrapper', item.id === currentActiveId ? 'active' : '']"
          v-for="item in portraits"
          :key="item.id"
          @click="toggleImg(item)"
        >
          <img :src="item.src" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import portrait_1 from "@/assets/portraits/queen_hearts.png";
import portrait_2 from "@/assets/portraits/uncle-sam-wants-you.png";
import portrait_3 from "@/assets/portraits/usa-new-york.png";
import Toast from "@/libs/Toast.js";
import ReadFileAsImg from "@/utils/readFileAsImg";
import Hammer from "hammerjs";
import GetTransformInfo from "@/utils/getTransformInfo";

export default {
  data() {
    return {
      portraits: [
        { id: 1, src: portrait_1 },
        { id: 2, src: portrait_2 },
        { id: 3, src: portrait_3 },
        { id: 4, src: portrait_1 },
        { id: 5, src: portrait_2 },
        { id: 6, src: portrait_3 },
        { id: 7, src: portrait_1 },
        { id: 8, src: portrait_2 },
        { id: 9, src: portrait_3 },
        { id: 10, src: portrait_1 },
        { id: 11, src: portrait_2 },
        { id: 12, src: portrait_3 },
      ],
      currentActiveId: 1,
      currentImgSrc: portrait_1,
      userImg: null,
      pgCanvas: {
        width: null,
        height: null,
      },
      pgControl: {
        width: "100px",
        height: "100px",
      },
      controlPos: {
        x: 0,
        y: 0,
      },
    };
  },
  created() {},
  watch: {
    currentImgSrc() {
      this.setCanvasSize();
    },
  },
  methods: {
    toggleImg(item) {
      if (this.currentActiveId !== item.id) {
        this.currentActiveId = item.id;
        const matched = this.portraits.find(
          (v) => v.id === this.currentActiveId
        );
        this.currentImgSrc = matched.src;
      }
    },
    handleFiles(e) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        return new Toast({ msg: "请上传图片" });
      }
      ReadFileAsImg(file).then((dataUrl) => {
        this.userImg = dataUrl;
      });
    },
    uploadOnClick() {
      this.$refs.uploadElem.click();
    },
    downloadOnClick() {
      new Toast({
        msg: "哈哈哈哈",
      });
    },
    setCanvasSize() {
      this.getImgSize(this.currentImgSrc).then(({ width, height }) => {
        this.pgCanvas.width = width + "px";
        this.pgCanvas.height = height + "px";
      });
    },
    getImgSize(imgSrc) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
      });
    },
    // 为图片控制区域初始化拖曳事件
    initControlPanEvent() {
      const { controlMain } = this.$refs;
      const activeIds = ["pg-handle-main", "pg-handle-drag"];
      const panEvtHandler = new Hammer(controlMain);
      panEvtHandler.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      // 监听拖动事件
      panEvtHandler.on("pan", (ev) => {
        if (activeIds.includes(ev.target.id)) {
          const { x, y } = this.controlPos;
          controlMain.style.transform = `translate3d(${x + ev.deltaX}px, ${
            y + ev.deltaY
          }px, 0)`;
        }
      });
      // 拖动结束后记录translate值
      panEvtHandler.on("panend", (ev) => {
        const { x, y } = GetTransformInfo(controlMain);
        this.controlPos.x = x;
        this.controlPos.y = y;
      });
    },
    // 为图片控制区域初始化二指缩放事件
    initControlPinchEvent() {
      const { controlMain } = this.$refs;
      const pinchEvtHandler = new Hammer(controlMain);
      pinchEvtHandler.get("pinch").set({ enable: true });
      // 监听二指缩放
      pinchEvtHandler.on("pinch", (ev) => {
        if (ev.target.id === "pg-handle-main" && ev.scale !== 1) {
          const scale = ev.scale.toFixed(2) < 1 ? 0.99 : 1.02;
          const newWidth = parseInt(parseInt(controlMain.style.width) * scale);
          const newHeight = parseInt(
            parseInt(controlMain.style.height) * scale
          );
          this.pgControl.width = newWidth + "px";
          this.pgControl.height = newHeight + "px";
          console.log(this.pgControl);
        }
      });
    },
    // 四个方向拖动放大图片
    initControlDirPanEvent() {
      const directionIds = [
        "pg-handle-scale-lt",
        "pg-handle-scale-lb",
        "pg-handle-scale-rt",
        "pg-handle-scale-rb",
      ];
      directionIds.forEach((id) => {
        const el = document.querySelector(`#${id}`);
        const direction = id.split("-")[3];
        const panEvtHandler = new Hammer(el);
        panEvtHandler.get("pan").set({ direction: Hammer.DIRECTION_ALL });
        // 监听拖动事件
        panEvtHandler.on("pan", (ev) => {
          if (ev.target.id === id) {
            this.scaleControl(direction, ev);
          }
        });
      });
    },
    // 根据四个方向调整控制区域及用户图像的宽高
    scaleControl(pos, ev) {
      // console.log(pos);
      // console.log(ev);
      const { controlMain } = this.$refs;
      const { angle, deltaX, deltaY } = ev;
      let threshold = 2;
      switch (pos) {
        case "lt":
          const newX_lt = deltaX > 0 ? threshold : -threshold;
          const newY_lt = deltaY > 0 ? threshold : -threshold;
          if (angle > 20 && angle < 70) {
            // 缩小
            this.pgControl.width = parseInt(this.pgControl.width) - newX_lt + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) - newY_lt + "px";
          } else if (angle > -160 && angle < -110) {
            // 放大
            this.pgControl.width = parseInt(this.pgControl.width) - newX_lt + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) - newY_lt + "px";
          }
          break;
        case "lb":
          const newX_lb = deltaX > 0 ? threshold : -threshold;
          const newY_lb = deltaY > 0 ? threshold : -threshold;
          if (angle > -70 && angle < -20) {
            // 缩小
            this.pgControl.width = parseInt(this.pgControl.width) - newX_lb + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) + newY_lb + "px";
          } else if (angle > 110 && angle < 160) {
            // 放大
            this.pgControl.width = parseInt(this.pgControl.width) - newX_lb + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) + newY_lb + "px";
          }
          break;
        case "rt":
          const newX_rt = deltaX > 0 ? threshold : -threshold;
          const newY_rt = deltaY < 0 ? threshold : -threshold;
          if (angle > 110 && angle < 160) {
            // 缩小
            this.pgControl.width = parseInt(this.pgControl.width) + newX_rt + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) + newY_rt + "px";
          } else if (angle > -70 && angle < -20) {
            // 放大
            this.pgControl.width = parseInt(this.pgControl.width) + newX_rt + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) + newY_rt + "px";
          }
          break;
        case "rb":
          const newX_rb = deltaX > 0 ? threshold : -threshold;
          const newY_rb = deltaY > 0 ? threshold : -threshold;
          if (angle > -160 && angle < -110) {
            // 缩小
            this.pgControl.width = parseInt(this.pgControl.width) + newX_rb + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) + newY_rb + "px";
          } else if (angle > 20 && angle < 70) {
            // 放大
            this.pgControl.width = parseInt(this.pgControl.width) + newX_rb + "px";
            this.pgControl.height =
              parseInt(this.pgControl.height) + newY_rb + "px";
          }
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.setCanvasSize();
    this.initControlPanEvent();
    this.initControlPinchEvent();
    this.initControlDirPanEvent();
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  background: url(../assets/bg.png);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .pg-panel {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 20px 0px #000;
    width: 90%;
    margin: 40px auto 120px;
    overflow-x: auto;
    .pg-canvas {
      position: relative;
      background-color: gray;
      overflow: hidden;
      margin: auto;
      user-select: none;
      .pg-transformable-img {
        width: 80px;
        z-index: 99;
        position: absolute;
      }
      .pg-transformable-control {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 888;
        border: dashed 1px #fff;
        cursor: move;
        touch-action: none;
        user-select: none;
        -webkit-user-drag: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        .pg-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          touch-action: pan-x pan-y;
        }
        .pg-handle-drag {
          top: 50%;
          left: 50%;
          background: url("../icons/drag.svg");
          margin-left: -10px;
          margin-top: -10px;
        }
        .pg-handle-scale-lt {
          left: -3px;
          top: -3px;
          background: url("../icons/scale-lt.svg");
        }
        .pg-handle-scale-lb {
          left: -3px;
          bottom: -3px;
          background: url("../icons/scale-lb.svg");
        }
        .pg-handle-scale-rt {
          right: -3px;
          top: -3px;
          background: url("../icons/scale-rt.svg");
        }
        .pg-handle-scale-rb {
          right: -3px;
          bottom: -3px;
          background: url("../icons/scale-rb.svg");
        }
      }
      .pg-overlay-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        object-fit: contain;
        z-index: 500;
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .pg-action {
    z-index: 666;
    position: fixed;
    bottom: 130px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .btn {
      box-shadow: 0px 0px 20px 0px #2b2b2b;
      width: 35%;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
      &.btn-primary {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
      &.btn-success {
        color: #fff;
        background-color: #67c23a;
        border-color: #67c23a;
      }
    }
    .hiddenInput {
      display: none;
    }
  }
  .pg-overlay-imgs-selector {
    user-select: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-x: auto;
    overflow-y: hidden;
    background-color: white;
    padding: 10px 0 10px 10px;
    box-shadow: 0px 0px 20px 0px #000;
    z-index: 999;
    .container {
      display: inline-flex;
      .img-wrapper {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        box-sizing: border-box;
        padding: 5px;
        margin-right: 10px;
        transition: all ease-in-out 0.1s;
        border-radius: 5px;
        border: 2px solid rgba($color: #409eff, $alpha: 0);
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .img-wrapper.active {
        border-color: rgba($color: #409eff, $alpha: 1);
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>