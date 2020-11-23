<template>
  <div class="main">
    <div class="pg-panel">
      <div class="pg-canvas" id="pg-canvas">
        <img class="pg-transformable-img" src="" />
        <div class="pg-transformable-control">
          <div class="pg-handle pg-handle-drag"></div>
          <div class="pg-handle pg-handle-scale-lt"></div>
          <div class="pg-handle pg-handle-scale-lb"></div>
          <div class="pg-handle pg-handle-scale-rt"></div>
          <div class="pg-handle pg-handle-scale-rb"></div>
        </div>
        <img class="pg-overlay-img" src="" />
      </div>
    </div>
    <div class="pg-action">
      <button>上传图片</button>
      <button>下载截图</button>
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
    };
  },
  created() {
    console.log(this.portraits);
  },
  methods: {
    toggleImg(item) {
      this.currentActiveId = item.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  background: url(../assets/bg.png);
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
  .container {
    display: inline-flex;
    .img-wrapper {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      box-sizing: border-box;
      padding: 5px;
      margin-right: 10px;
      transition: all ease-in-out .1s;
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
</style>