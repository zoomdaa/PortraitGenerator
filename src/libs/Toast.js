export default class Toast {
  constructor({ msg, timeout = 2000 } = {}) {
    this.bodyEl = document.body;
    this.msg = msg;
    this.timeout = timeout;
    this.showToast();
  }
  showToast() {
    const myToast = this.getToast();
    if (myToast) this.removeToast(myToast);
    const newToast = this.createToastEl();
    this.bodyEl.appendChild(newToast);
    this.delayRemoveToast(newToast);
  }
  getToast() {
    return document.querySelector("my-toast");
  }
  createToastEl() {
    const wrapper = document.createElement("div");
    wrapper.className = "my-toast";
    wrapper.style.position = "fixed";
    wrapper.style.top = "50%";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
    wrapper.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    wrapper.style.borderRadius = "5px";
    wrapper.style.padding = "5px 15px";
    wrapper.style.color = "#fff";
    wrapper.style.transition = "all ease-in-out .3s";
    wrapper.style.fontSize = "14px";
    wrapper.style.zIndex = "9999";

    const msgEl = document.createElement("span");
    msgEl.innerHTML = this.msg;
    wrapper.appendChild(msgEl);

    setTimeout(() => {
      wrapper.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
    });
    return wrapper;
  }
  delayRemoveToast(toastEl) {
    setTimeout(() => {
      this.removeToast(toastEl);
    }, this.timeout);
  }
  removeToast(toastEl) {
    toastEl.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
    setTimeout(() => {
      this.bodyEl.removeChild(toastEl);
    }, 301);
  }
}
