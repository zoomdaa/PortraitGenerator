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
          ref="controlMain"
        >
          <div class="pg-handle pg-handle-drag"></div>
          <div class="pg-handle pg-handle-scale-lt"></div>
          <div class="pg-handle pg-handle-scale-lb"></div>
          <div class="pg-handle pg-handle-scale-rt"></div>
          <div class="pg-handle pg-handle-scale-rb"></div>
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
import ReadFileAsImg from "@/utils/readFileAsImg.js";
import { onPan } from "@/utils/hammer";
import Hammer from "hammerjs";

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
    initControlEvent() {
      const { controlMain } = this.$refs;
      const hammer = new Hammer(controlMain);
      hammer.on("pan", (ev) => {
        // console.log(controlMain.style)
        // controlMain.style.transform = `translate3d(${ev.deltaX}px, ${ev.deltaY}px, 0)`
        console.log(ev)
      });
    },
  },
  mounted() {
    this.setCanvasSize();
    this.initControlEvent();
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