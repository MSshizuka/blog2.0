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
  const getCodeFormRule = computed(() => createRule('请输入验证码'));
  const getPasswordFormRule = computed(() => createRule('请输入新密码'));

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const codeFormRule = unref(getCodeFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    return {
      code: codeFormRule,
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
