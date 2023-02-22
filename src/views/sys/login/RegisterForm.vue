<template>
  <h1>register</h1>
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
        autocomplete="off"
        placeholder="请输入用户名"
        class="fix-auto-fill"
        @blur="verifyExist({ username: formData.username })"
        :maxlength="30"
      />
    </FormItem>
    <FormItem name="email" class="enter-x" v-if="registerType === 'email'">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.email"
        autocomplete="off"
        placeholder="请输入邮箱"
        class="fix-auto-fill"
        :maxlength="30"
      />
    </FormItem>
    <FormItem name="phone" class="enter-x" v-if="registerType === 'phone'">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.phone"
        autocomplete="off"
        placeholder="请输入手机号"
        @input="handleInput"
        class="fix-auto-fill"
        :maxlength="11"
      />
    </FormItem>
    <FormItem name="code" class="enter-x">
      <Input
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        size="large"
        v-model:value.trim="formData.code"
        @input="handleInput"
        autocomplete="off"
        placeholder="验证码"
        class="fix-auto-fill"
        :maxlength="6"
      />
      <button class="absolute px-2 right-0 bottom-4" :disabled="!isAllowClick" @click="queryCode">{{
        isAllowClick ? '获取验证码' : `${CountDown}s之后重试`
      }}</button>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.password"
        placeholder="请输入密码"
        autocomplete="new-password"
        class="fix-auto-fill"
        type="password"
        :maxlength="20"
      />
    </FormItem>

    <span @click="toggleRegisterType" class="text-violet-400 cursor-pointer"
      >使用{{ registerDesc }}注册</span
    >

    <FormItem class="enter-x">
      <Button size="large" block @click="handleLogin" :loading="loading" class="rounded-md mt-4">
        注册
      </Button>
    </FormItem>
  </Form>
  <a href="javascript:;" @click="toLogin" class="ml-32 text-violet-400" v-if="getIsMobile"
    >去登录</a
  >
</template>
<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';

  import { Form, Input, Button } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { useFormRules, useFormValid } from './useRegister';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { userRegister, verfiy, createCode } from '/@/api/user';

  const FormItem = Form.Item;
  const { createMessage } = useMessage();
  const canQueryCode = ref(false); // 是否可以发送验证码

  const { getFormRules } = useFormRules();

  const emit = defineEmits(['login']);

  const registerType = ref('phone');

  const toggleRegisterType = () => {
    formData.email = '';
    formData.phone = '';
    registerType.value = registerType.value === 'phone' ? 'email' : 'phone';
  };

  const registerDesc = computed(() => (registerType.value === 'email' ? '手机号' : '邮箱'));

  const toLogin = () => {
    emit('login', 'login');
  };

  /* 只能输入数字 */
  const handleInput = () => {
    formData.code = formData.code.replace(/[^\d]/g, '');
    if (registerType.value === 'phone') {
      formData.phone = formData.phone.replace(/[^\d]/g, '');
    }
  };
  const isAllowClick = ref(true);

  const verifyExist = async (obj) => {
    const { username, email, phone } = obj;
    if (username) {
      if (!/^([\u4e00-\u9fa5a-z0-9])+$/gi.test(username)) {
        return createMessage.error('至少包含中英文、数字中的两种');
      }
      await verfiy('username', obj);
    }
    if (email || phone) {
      if (toValidate()) return;
      try {
        const { message } = await verfiy(email ? 'email' : 'phone', obj);
        if (message === 'success') {
          canQueryCode.value = true;
        } else {
          canQueryCode.value = false;
        }
      } catch (err) {
        canQueryCode.value = false;
      }
    }
  };

  const { getIsMobile } = useAppInject();
  const formRef = ref();
  const loading = ref(false);
  const CountDown = ref(60);
  const timer = ref<null | Number>(null);

  const formData = reactive({
    username: '',
    password: '',
    email: '',
    code: '',
    phone: '',
  });

  const { validForm } = useFormValid(formRef);

  const toValidate = (): Boolean => {
    if (registerType.value === 'email') {
      canQueryCode.value = false;
      if (!formData.email) {
        createMessage.error('请输入邮箱地址！');
        return true;
      }
      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(formData.email)) {
        createMessage.error('请输入正确的邮箱地址！');
        return true;
      }
    } else if (registerType.value === 'phone') {
      canQueryCode.value = false;
      if (!formData.phone) {
        createMessage.error('请输入手机号！');
        return true;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        createMessage.error('请输入正确的手机号！');
        return true;
      }
    }
    canQueryCode.value = true;
    return false;
  };

  const queryCode = async (e) => {
    e.preventDefault();
    if (toValidate()) return;
    const data =
      registerType.value === 'email' ? { email: formData.email } : { phone: formData.phone };
    await verifyExist(data);
    if (!canQueryCode.value) return;
    isAllowClick.value = false;
    startCountDown();
    await createCode(data);
  };

  /* 倒计时 */
  const startCountDown = () => {
    timer.value = window.setInterval(() => {
      if (CountDown.value === 0) {
        isAllowClick.value = true;
        window.clearInterval(timer.value as any);
        CountDown.value = 60;
        return;
      }
      CountDown.value = CountDown.value - 1;
    }, 1000);
  };

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const { message } = await userRegister({
        password: data.password,
        username: data.username,
        phone: data.phone,
        email: data.email,
        code: data.code,
      });
      createMessage.success(message);
      toLogin();
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  @import url('./form.less');
</style>
