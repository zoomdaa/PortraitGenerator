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
    <div class="pg-overlay-imgs-selector"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      str: "Main page",
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  background: url(../assets/bg.png);
}
</style>