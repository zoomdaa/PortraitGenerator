import html2canvas from "html2canvas";
export default class DownloadDom {
  constructor({ el, tips = "提示：请长按图片进行保存" } = {}) {
    if (!el) return;
    this.el = el;
    this.tips = tips;
    this.startDownload();
  }

  async startDownload() {
    this.mask = this.generateMask();
    const img = await this.generateImg();
    const tips = this.generateTipsText();
    const closeBtn = this.generateCloseBtn();
    const tipsWrapper = this.generateTipsWrapper();
    tipsWrapper.appendChild(tips);
    tipsWrapper.appendChild(closeBtn);
    this.mask.appendChild(img);
    this.mask.appendChild(tipsWrapper);
    document.body.appendChild(this.mask);
    this.mask.style.visibility = "visible";
    this.mask.style.opacity = "1";
  }

  // 生成蒙层
  generateMask() {
    const Mask = document.createElement("div");
    Mask.style.position = "fixed";
    Mask.style.zIndex = 1999;
    Mask.style.top = "0";
    Mask.style.right = "0";
    Mask.style.bottom = "0";
    Mask.style.left = "0";
    Mask.style.backgroundColor = "rgba(0,0,0,.3)";
    Mask.style.transition = "all .3s cubic-bezier(0.36, 0.66, 0.04, 1)";
    Mask.style.visibility = "hidden";
    Mask.style.opacity = "0";
    Mask.style.textAlign = "center";
    Mask.style.fontSize = "0";
    Mask.style.userSelect = "none";
    return Mask;
  }

  // 根据对应dom生成png
  generateImg() {
    return new Promise((resolve, reject) => {
      const { el } = this;
      html2canvas(el)
        .then((canvas) => {
          const dataUrl = canvas.toDataURL();
          const img = new Image();
          img.src = dataUrl;
          img.style.width = "80%";
          img.style.margin = "50px auto 20px";
          img.style.userSelect = "none";
          resolve(img);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  // 生成提示区域容器
  generateTipsWrapper() {
    const wrapper = document.createElement("div");
    wrapper.style.width = "80%";
    wrapper.style.padding = "10px";
    wrapper.style.backgroundColor = "#fff";
    wrapper.style.borderRadius = "10px";
    wrapper.style.margin = "0 auto";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.userSelect = "none";
    wrapper.style.fontSize = "16px";
    return wrapper;
  }

  // 生成提示文字
  generateTipsText() {
    const { tips } = this;
    const text = document.createElement("div");
    text.innerHTML = tips;
    text.style.textAlign = "center";
    text.style.color = "#757373";
    text.style.fontSize = "15px";
    return text;
  }

  // 生成关闭按钮
  generateCloseBtn() {
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "关闭截图";
    closeBtn.style.marginTop = "10px";
    closeBtn.style.color = "#2e83da";
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(this.mask);
      this.closeCallBack();
    });
    return closeBtn;
  }

  // 注册截图被关闭时的回调
  onClose(fn) {
    this.closeCallBack = fn;
  }
}
