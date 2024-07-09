<template>
  <div class="login">
    <div class="form">
      <div class="title">请登录</div>
      <el-form ref="formRef" :model="formData">
        <el-form-item
          prop="username"
          :rules="[{ required: true, message: '请输入用户名', trigger: 'change' }]">
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
          :rules="[{ required: true, message: '请输入密码', trigger: 'change' }]">
          <el-input
            size="large"
            type="password"
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
</template>

<script setup lang="ts">
import { loginApi } from '@/apis/user'
import { setToken } from '@/common/utils'
import { User, Lock } from '@element-plus/icons-vue'
import { ElForm, ElMessage } from 'element-plus'
import { redirectKey } from './const'

const router = useRouter()
const route = useRoute()

const formData: Parameters<typeof loginApi>[0] = reactive({
  username: 'haadmin',
  password: '123456'
})
const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const onSubmit = async () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const { data: res } = await loginApi(formData)
        setToken('bearer ' + res)
        router.push((route.query[redirectKey] ?? '/') as string)
        ElMessage.success('登陆成功！')
      } catch (error: any) {
        ElMessage.error(error.msg || '登陆失败！')
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
  background-image: url('./images/bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 420px;
    padding: 50px 60px;
    background-color: #fff;
    border-radius: 8px;
    transform: translate(-50%, -50%);

    > .title {
      margin-bottom: 16px;
      font-weight: bold;
      text-align: center;
    }

    > .el-button {
      width: 100%;
    }
  }
}
</style>
