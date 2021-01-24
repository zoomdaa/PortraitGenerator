import wx from 'weixin-js-sdk'
import { getWxSign } from "@/api/index";
const APPID = 'wx01685f461957b74f'

/**
 * 通过config接口注入权限验证配置
 * @param {Number} timestamp 生成签名的时间戳
 * @param {String} nonceStr 生成签名的随机串
 * @param {String} signature 签名
 */
export const _initWechatConfig = async () => {
  const { nonceStr, signature, timestamp } = await getWxSign()
  return new Promise((resolve, reject) => {
    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: APPID, // 必填，公众号的唯一标识
      timestamp,
      nonceStr,
      signature,
      jsApiList: ['chooseInvoiceTitle'] // 必填，需要使用的JS接口列表
    });
    wx.ready(resolve)
    wx.error(reject)
  })
}

/**
 * 判断当前客户端版本是否支持指定JS接口
 */
export const _checkJsApi = () => {
  return new Promise(resolve => {
    wx.checkJsApi({
      jsApiList: ['chooseInvoiceTitle'],
      success: (res) => {
        const { chooseInvoiceTitle } = res.checkResult
        resolve(chooseInvoiceTitle || false)
      }
    })
  })
}

