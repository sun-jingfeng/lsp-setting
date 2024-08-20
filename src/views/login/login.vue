<template>
  <div class="login">
    <div class="center">
      <div class="title">
        <img v-if="showLogo" src="./images/title.png" />
        <img src="./images/name.png" />
      </div>
      <div class="content">
        <el-form ref="formRef" :model="formData" label-position="top">
          <el-form-item
            prop="username"
            label="用户名"
            :rules="[{ required: true, message: '请输入用户名', trigger: ['change', 'blur'] }]">
            <el-input
              size="large"
              v-model="formData.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
              @keydown.enter="onSubmit" />
          </el-form-item>
          <el-form-item
            prop="password"
            label="密码"
            :rules="[{ required: true, message: '请输入密码', trigger: ['change', 'blur'] }]">
            <el-input
              size="large"
              type="password"
              show-password
              v-model="formData.password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              clearable
              @keydown.enter="onSubmit" />
          </el-form-item>
        </el-form>
        <el-button size="large" type="primary" @click="onSubmit" :loading="loading">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginApi } from '@/apis/user'
import { setToken } from '@/common/utils'
import { User, Lock } from '@element-plus/icons-vue'
import { ElForm, ElMessage } from 'element-plus'
import { redirectKey } from './const'
import { showLogo } from '@/common/const'

const router = useRouter()
const route = useRoute()

const formData: Parameters<typeof loginApi>[0] = reactive({
  username: '',
  password: ''
})
const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const onSubmit = async () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const { data: res } = await loginApi(formData)
        setToken('Bearer ' + res)
        router.push((route.query[redirectKey] ?? '/') as string)
        ElMessage.success('登录成功！')
      } catch (error: any) {
        ElMessage.error(error.msg || '登录失败！')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url('./images/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  > .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    > .title {
      display: flex;
      align-items: center;
      justify-content: center;

      > img {
        margin-right: 12px;
      }
    }

    > .content {
      width: 492px;
      height: 468px;
      padding: 100px 80px 0;
      background-image: url('./images/bg2.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;

      > .el-form {
        --g-text-color-3: #fff;

        > .el-form-item {
          margin-bottom: 40px;

          .el-input {
            --el-input-text-color: #fff;
            --el-text-color-placeholder: rgb(255 255 255 / 50%) !important;
            --el-input-border-radius: 0;
            --el-border-color: #4160df !important;
            --el-border-color-hover: #53b2ff !important;
            --el-input-bg-color: transparent !important;
          }
        }
      }

      > .el-button {
        --el-border-radius-base: 0;
        --el-button-bg-color: #4759ff;
        --el-button-border-color: #4759ff;

        width: 100%;
        letter-spacing: 12px;
      }
    }
  }
}
</style>
