<!--
 * @Author: Harry
 * @Date: 2022-07-05 11:54:55
 * @LastEditors: harry
 * @Github: https://github.com/rr210
 * @LastEditTime: 2022-07-13 23:36:58
 * @FilePath: \mongodb\src\views\Setting\setMain\SetCompress.vue
-->
<template>
  <div class="set-commpress">
    <el-switch v-model="value" @change="handleComp" active-text="开启" inactive-text="关闭" :active-value="true"
      :inactive-value="false">
    </el-switch>

    <div class="block-compress" v-show="value">
      <span class="demonstration">压缩等级({{ value1 }})</span>
      <div class="slide-w">
        <el-slider @change="handleComp" show-input v-model="value1" :step="0.1" :max="1" show-steps>
        </el-slider>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'pinia'
import useStore from '@/store/'
import { Notification } from 'element-ui'
const store = useStore()

export default {
  data() {
    return {
      value: false,
      value1: 0.8
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.value = store.CompressData.iscompress
      this.value1 = store.CompressData.rank
    })
  },
  methods: {
    handleComp: function (e) {
      const params = {
        iscompress: this.value, rank: this.value1
      }
      const _this = this
      store.setDefaultCompress(params)
      Notification({
        title: '压缩功能提示',
        message: `上传压缩功能${_this.value ? '已开启' : '已关闭'},${_this.value ? '压缩等级为:' + _this.value1 : ''}`,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './setcom.module.less';
</style>
