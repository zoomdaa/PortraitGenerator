import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vConsole from "vconsole";
new vConsole();

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
