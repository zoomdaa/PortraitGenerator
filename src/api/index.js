import { Get } from '@/utils/request'

export const getWxSign = () => {
  return Get({
    url: '/wx/sign',
    data: {
      url: window.location.href.split('#')[0]
    }
  })
}