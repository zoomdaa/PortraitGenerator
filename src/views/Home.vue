<template>
  <div id="home">
      <img src="../assets/logo.png" alt="logo" />
      <h1>{{ str }}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      str: 'Hello World'
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  color: blue;
  h1 {
    color: red;
  }
}
</style>