import html2canvas from "html2canvas";
export default class DownloadDom {
  constructor({ el, tips = "请长按图片进行保存" } = {}) {
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
    this.mask.appendChild(img);
    this.mask.appendChild(tips);
    this.mask.appendChild(closeBtn);
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
    return Mask;
  }

  // 根据对应dom生成png
  generateImg() {
    return new Promise((resolve, reject) => {
      const { el } = this;
      console.log(el);
      html2canvas(el)
        .then((canvas) => {
          const dataUrl = canvas.toDataURL();
          console.log(dataUrl)
          const img = new Image();
          img.src = dataUrl;
          img.style.width = "80%";
          img.style.margin = "100px auto 50px";
          resolve(img);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  // 生成提示文字
  generateTipsText() {
    const { tips } = this;
    const text = document.createElement("div");
    text.innerHTML = tips;
    text.style.textAlign = "center";
    return text;
  }

  // 生成关闭按钮
  generateCloseBtn() {
    const button = document.createElement("button");
    button.innerText = "关闭";
    return button;
  }
}
