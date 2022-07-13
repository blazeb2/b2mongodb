import useStore from '@/store'
import { getConfig, saveConfigMsg, updateConfig } from '../api'
import { Notification } from 'element-ui'
const formData = {
  APPID: '',
  HOST_URL: '',
  BUCKETNAME: '',
  DEFAULT_UPLOAD_WAY: '',
  IS_OPEN_COMPRESS: false,
  COMPRESS_VALUE: '',
  PREFIX_IMAGE: '',
  SEARCH_METHODS: '',
  DEFAULT_FILE_WAY: ''
}
const saveMsg = function () {
  const token = localStorage.getItem('token_api')
  const store = useStore()
  const t_ = JSON.parse(token)
  console.log(store)
  if (t_) {
    formData.APPID = t_.application_key_id
    formData.BUCKETNAME = t_.bucket_name
    formData.DEFAULT_FILE_WAY = store.imgDefaultFile
    formData.DEFAULT_UPLOAD_WAY = store.DefaultToFile
    formData.COMPRESS_VALUE = store.commpressParams.rank
    formData.HOST_URL = t_.host_url
    formData.PREFIX_IMAGE = store.prefixImg.defaultUrl
    formData.SEARCH_METHODS = store.setdefaultFile.methods
    formData.IS_OPEN_COMPRESS = store.commpressParams.iscompress
    formData.FORMSTR_DEFAULT = store.defaultCopy
    formData.DEFAULT_COPY_URL = store.defaultCopyUrl
    formData.CREATE_TIME = Date.now()
  }
  saveConfigMsg(formData)
}

// 数据更新
const updateConfigMsg = async function (title, data) {
  const token = localStorage.getItem('token_api')
  const _t = JSON.parse(token)
  const d_ = Object.assign(data, { APPID: _t.application_key_id })
  await updateConfig(d_)
  Notification({
    title,
    type: 'info',
    message: title + '已上传至服务器'
  })
}
// 检查是否存在配置信息

const getConfigMsg = function (APPID) {
  return getConfig({
    params: {
      APPID
    }
  })
}

export {
  saveMsg, updateConfigMsg, getConfigMsg
}
