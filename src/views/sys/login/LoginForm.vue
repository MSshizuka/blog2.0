<template>
  <h1>login</h1>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="handleLogin"
  >
    <FormItem name="username" class="enter-x">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.username"
        placeholder="用户名、手机号或邮箱"
        autocomplete="off"
        class="fix-auto-fill"
        :maxlength="30"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <Input
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        autocomplete="new-password"
        size="large"
        v-model:value.trim="formData.password"
        placeholder="请输入密码"
        class="fix-auto-fill"
        type="password"
        :maxlength="20"
      />
    </FormItem>

    <FormItem class="enter-x">
      <Button size="large" block @click="handleLogin" :loading="loading" class="rounded-md mt-4">
        登录
      </Button>
    </FormItem>
  </Form>

  <div class="w-full px-10 flex justify-between">
    <div
      @click="modifyAction('register')"
      class="text-violet-400 cursor-pointer"
      v-if="getIsMobile"
    >
      去注册
    </div>
    <div @click="modifyAction('modify')" class="text-violet-400 cursor-pointer"> 忘记密码 </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  import { Form, Input, Button } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { useFormRules, useFormValid } from './useLogin';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const FormItem = Form.Item;
  const { notification } = useMessage();
  const userStore = useUserStore();
  const emit = defineEmits(['modify']);

  const modifyAction = (payload) => {
    emit('modify', payload);
  };

  const { getIsMobile } = useAppInject();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.username,
      });
      if (userInfo) {
        notification.success({
          message: '登录成功',
          description: `欢迎： ${userInfo.username}`,
          duration: 1,
        });
      }
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  @import url('./form.less');
</style>
