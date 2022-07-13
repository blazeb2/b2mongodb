/*
 * @Author: Harry
 * @Date: 2022-07-01 12:52:23
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-07-13 22:57:18
 * @FilePath: \mongodb\src\store\index.js
 */
import { defineStore } from 'pinia'
import { authIsexit } from '../utils/common/login'
import { updateConfigMsg } from '../utils/common/mongodb'
import { Notification } from 'element-ui'
const useStore = defineStore('store', {
  // 开启数据缓存
  persist: {
    enabled: true
  },
  state: () => {
    return {
      isLogined: false, // 是否输入formview
      noInvalid: false, // 是否验证过期，默认过期
      defaultcopyformat: {
        formatList: {
          HTML: '<img src="%s" alt="" />',
          MarkDown: '![](%s)',
          URL: '%s',
          Custom: ''
        },
        formatStr: 'URL'
      },
      prefixImg: {
        support: [],
        defaultUrl: ''
      },
      setdefaultFile: {
        methods: '1',
        valPt: '',
        valAt: []
      },
      commpressParams: {
        iscompress: false,
        rank: 0.8
      },
      toFile: '',
      isdatabase: false
    }
  },
  getters: {
    databaseStatus(state) {
      return state.isdatabase
    },
    // 登录状态
    siginStatus(state) {
      return !state.isLogined
    },
    defaultCopy(state) {
      return state.defaultcopyformat.formatStr
    },
    defaultCopyUrl(state) {
      const a_ = state.defaultcopyformat.formatStr
      return state.defaultcopyformat.formatList[a_]
    },
    prefixStatus(state) {
      return state.prefixImg.defaultUrl
    },
    // 图片默认返回
    imgDefaultFile(state) {
      const med = state.setdefaultFile.methods
      if (med === '1') {
        return state.setdefaultFile.valPt
      } else if (med === '2') {
        return state.setdefaultFile.valAt.join('/') + '/'
      } else {
        return ''
      }
    },
    // 配置默认返回
    defaultFile(state) {
      return state.setdefaultFile
    },
    CompressData(state) {
      return state.commpressParams
    },
    DefaultToFile(state) {
      return state.toFile
    }
  },
  actions: {
    setdatabase(e) {
      this.isdatabase = e
    },
    handleIsLogined() {
      this.isLogined = !!localStorage.getItem('token_api')
      this.noInvalid = !!localStorage.getItem('authmsg')
    },
    setNewAuthMsg() {
      authIsexit().then(() => {
        this.isLogined = true
      })
    },
    setprefixImg(obj) {
      this.prefixImg = obj
    },
    // 设置图片的默认前缀
    setDefaultPrefix(name) {
      this.prefixImg.defaultUrl = name
      if (this.isdatabase) {
        updateConfigMsg('默认图片前缀地址设置', { DEFAULT_FILE_WAY: name })
      }
    },
    setDefaultFile(o) {
      this.setdefaultFile.methods = o.methods
      this.setdefaultFile.valAt = o.valAt
      this.setdefaultFile.valPt = o.valPt
      if (this.isdatabase) {
        updateConfigMsg('搜索图片默认配置', { SEARCH_METHODS: o.methods, DEFAULT_FILE_WAY: this.imgDefaultFile })
      }
    },
    // 设置压缩参数
    setDefaultCompress(obj) {
      this.commpressParams = obj
      if (this.isdatabase) {
        const { rank, iscompress } = obj
        updateConfigMsg('图片压缩配置', { COMPRESS_VALUE: rank, IS_OPEN_COMPRESS: iscompress })
      }
    },
    // 设置默认上传地址
    setDefaultToFile(a) {
      this.toFile = a
      if (this.isdatabase) {
        updateConfigMsg('默认上传图片地址设置', { DEFAULT_UPLOAD_WAY: a })
      }
    },
    // 处理格式问题
    setDefaultFormat(e) {
      this.defaultcopyformat.formatStr = e
      if (this.isdatabase && e !== 'Custom') {
        updateConfigMsg('上传成功后默认链接格式配置', { FORMSTR_DEFAULT: e })
      }
    },
    // 设置自定义格式
    setCustomFormat(e) {
      this.defaultcopyformat.formatList.Custom = e
      if (this.isdatabase) {
        updateConfigMsg('自定义链接格式配置', { DEFAULT_COPY_URL: e })
      }
    },
    /**
     * 将从数据库中请求的数据存到pinia中
     */
    setPiniaStr(e) {
      // BUCKETNAME
      const { COMPRESS_VALUE, DEFAULT_COPY_URL, DEFAULT_FILE_WAY, DEFAULT_UPLOAD_WAY, FORMSTR_DEFAULT, IS_OPEN_COMPRESS, PREFIX_IMAGE, SEARCH_METHODS } = e
      this.commpressParams.rank = COMPRESS_VALUE
      this.defaultcopyformat.formatList.Custom = DEFAULT_COPY_URL
      this.setdefaultFile.methods = SEARCH_METHODS
      if (SEARCH_METHODS === '1') {
        this.setdefaultFile.valPt = DEFAULT_FILE_WAY
      } else {
        this.setdefaultFile.valAt = DEFAULT_FILE_WAY.split('/').slice(0, -1)
      }
      this.toFile = DEFAULT_UPLOAD_WAY
      this.defaultcopyformat.formatStr = FORMSTR_DEFAULT
      this.commpressParams.iscompress = IS_OPEN_COMPRESS
      this.prefixImg.defaultUrl = PREFIX_IMAGE
      Notification({
        type: 'success',
        message: '请填写密钥，然后点击下方保存',
        title: '数据库提示'
      })
    }
  }
})
export default useStore
