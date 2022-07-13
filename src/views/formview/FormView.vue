<!--
 * @Author: Harry
 * @Date: 2022-06-24 17:04:27
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-07-13 19:48:58
 * @FilePath: \mongodb\src\views\formview\FormView.vue
-->
<template>
  <div class="form-w">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="application_key_id" prop="application_key_id">
        <el-input v-model="form.application_key_id" placeholder="请填写应用程序密钥id"></el-input>
      </el-form-item>
      <el-form-item v-if="form.application_key_id" prop="isdatabase" label="是否开启数据库存储配置">
        <el-switch v-model="form.isdatabase" @change="handleDatabaseBtn"></el-switch>
      </el-form-item>
      <el-form-item label="application_key" prop="application_key">
        <el-input v-model="form.application_key" show-password placeholder="请填写应用程序密钥"></el-input>
      </el-form-item>
      <el-form-item label="host_url" prop="host_url">
        <el-input v-model="form.host_url" placeholder="请填写地址,eg: https://cloud.mr90.top/ 注意:结尾必须加 ‘/’">
        </el-input>
      </el-form-item>
      <el-form-item label=" bucket_name" prop="bucket_name">
        <el-input v-model="form.bucket_name" placeholder="请填写存储桶名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formRef')">保存本地</el-button>
        <el-button @click="resetForm('formRef')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Notification } from 'element-ui'
import { mapActions, mapState } from 'pinia'
import { debounce } from '@/plugin/filter'
import useStore from '@/store'
import { authIsexit } from '@/utils/common/login'
import { saveMsg } from '@/utils/common/mongodb'
// import { saveConfigMsg } from '@/utils/api'
export default {
  data() {
    return {
      form: {
        application_key_id: '',
        application_key: '',
        bucket_name: '',
        host_url: '',
        isdatabase: false
      },
      rules: {
        application_key_id: [
          { required: true, message: '请输入application_key_id', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        application_key: [
          { required: true, message: '请输入application_key', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        bucket_name: [
          { required: true, message: '请输入bucket_name', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        isdatabase: [
          { required: true, message: '开启后将上传除了key密钥的所有配置信息', trigger: 'blur' }
        ],
        host_url: [
          { required: true, validator: this.validateURL, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(useStore, ['databaseStatus']),
    ...mapState(useStore, ['isLogined']) // 映射函数，取出tagslist
  },
  mounted() {
    const token = localStorage.getItem('token_api')
    if (token) {
      this.form = JSON.parse(token)
    }
  },
  methods: {
    ...mapActions(useStore, ['setdatabase']),
    ...mapActions(useStore, ['handleIsLogined']),
    // 检验表单
    validateURL: (rule, value, callback) => {
      const reg = value.charAt(value.length - 1) === '/'
      if (!reg || value.length === 0) {
        callback(new Error('请输入图片地址前缀，输入的连接结尾必须加 /'))
      } else {
        callback()
      }
    },
    handleDatabaseBtn(e) {
      console.log(e)
      this.setdatabase(e)
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          localStorage.setItem('token_api', JSON.stringify(this.form))
          localStorage.removeItem('authmsg')
          Notification({
            title: '提示',
            message: `已将配置信息${this.form.isdatabase ? '上传至服务器,除了key密钥的所有配置,如需删除请点击删除按钮' : '缓冲到本地，数据信息仅本人可知'}`,
            type: 'success'
          })
          await authIsexit()
          if (this.form.isdatabase) {
            // 执行上传数据库操作
            saveMsg()
            // saveConfigMsg()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, 400, true),
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
@import './formview.module.less';
</style>
