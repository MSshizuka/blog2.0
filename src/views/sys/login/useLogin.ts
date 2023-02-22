import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import { computed, unref, Ref } from 'vue';

export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}

export function useFormRules() {
  const getAccountFormRule = computed(() => createRule('请输入账号'));
  const getPasswordFormRule = computed(() => createRule('请输入密码'));

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const accountFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);

    return {
      username: accountFormRule,
      password: passwordFormRule,
    };
  });
  return { getFormRules };
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
