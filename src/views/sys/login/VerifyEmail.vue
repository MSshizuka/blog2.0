<template>
  <h1>修改密码</h1>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="queryCode"
  >
    <FormItem name="phone" class="enter-x" v-if="isPhoneWay">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.phone"
        placeholder="请输入手机号"
        autocomplete="off"
        class="fix-auto-fill"
        :maxlength="11"
      />
    </FormItem>

    <FormItem name="email" class="enter-x" v-else>
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.email"
        placeholder="请输入邮箱地址"
        autocomplete="off"
        class="fix-auto-fill"
        :maxlength="30"
      />
    </FormItem>

    <span @click="toggleRegisterType" class="text-violet-400 cursor-pointer"
      >使用{{ registerDesc }}验证</span
    >

    <FormItem class="enter-x">
      <Button size="large" block @click="queryCode" :loading="loading" class="rounded-md mt-4">
        发送验证码
      </Button>
    </FormItem>
  </Form>

  <div class="w-full px-10 flex justify-end">
    <div @click="doLogin" class="text-violet-400 cursor-pointer"> 去登录 </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';

  import { Form, Input, Button } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { sendCode } from '/@/api/user';
  import { useFormRules, useFormValid } from './useRegister';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const FormItem = Form.Item;
  const { createMessage } = useMessage();
  const { getIsMobile } = useAppInject();
  const { getFormRules } = useFormRules();

  const emits = defineEmits(['modify']);

  const formRef = ref();
  const loading = ref(false);
  const registerType = ref('phone');

  const doLogin = () => {
    emits('modify', 'login');
  };

  const toggleRegisterType = () => {
    formData.email = '';
    formData.phone = '';
    registerType.value = registerType.value === 'phone' ? 'email' : 'phone';
  };

  const registerDesc = computed(() => (registerType.value === 'email' ? '手机号' : '邮箱'));

  const isPhoneWay = computed(() => registerType.value === 'phone');

  const formData = reactive({
    email: '',
    phone: '',
  });

  const { validForm } = useFormValid(formRef);

  async function queryCode() {
    try {
      const data = await validForm();
      if (!data) return;
      loading.value = true;
      const res = await sendCode(
        isPhoneWay.value ? { phone: formData.phone } : { email: formData.email },
      );
      if (res) {
        createMessage.success(res.message);
        emits('modify', 'modifyPassword');
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  defineExpose({ formData, isPhoneWay });
</script>

<style lang="less" scoped>
  @import url('./form.less');
</style>
