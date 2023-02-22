<template>
  <h1>修改密码</h1>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="send"
  >
    <FormItem name="code" class="enter-x">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.code"
        placeholder="验证码"
        autocomplete="off"
        class="fix-auto-fill"
        :maxlength="6"
        @input="handleInput"
      />
    </FormItem>

    <FormItem name="password" class="enter-x">
      <Input
        size="large"
        :readonly="getIsMobile ? false : true"
        onfocus="this.removeAttribute('readonly')"
        v-model:value.trim="formData.password"
        placeholder="请输入新密码"
        autocomplete="off"
        class="fix-auto-fill"
        type="password"
        :maxlength="30"
      />
    </FormItem>

    <FormItem class="enter-x">
      <Button size="large" block @click="send" :loading="loading" class="rounded-md mt-4">
        确定
      </Button>
    </FormItem>
  </Form>

  <div class="w-full px-10 flex justify-end">
    <div @click="doLogin" class="text-violet-400 cursor-pointer"> 去登录 </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  import { Form, Input, Button } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { modifyPwd } from '/@/api/user';
  import { useFormRules, useFormValid } from './useModifyPwd';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const FormItem = Form.Item;
  const { createMessage } = useMessage();
  const { getIsMobile } = useAppInject();
  const { getFormRules } = useFormRules();

  const props = defineProps({
    currentEmail: { type: String, required: true },
    currentPhone: { type: String, required: true },
  });
  const emits = defineEmits(['modify']);

  const formRef = ref();
  const loading = ref(false);

  const doLogin = () => {
    emits('modify', 'login');
  };

  const formData = reactive({
    code: '',
    password: '',
  });

  const handleInput = () => {
    formData.code = formData.code.replace(/[^\d]/g, '');
  };

  const { validForm } = useFormValid(formRef);

  async function send() {
    try {
      const data = await validForm();
      if (!data) return;
      loading.value = true;
      console.log('props==>', props.currentEmail);
      const res = await modifyPwd({
        ...formData,
        email: props.currentEmail,
        phone: props.currentPhone,
      });
      if (res) {
        createMessage.success(res.message);
        emits('modify', 'login');
      }
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  @import url('./form.less');
</style>
