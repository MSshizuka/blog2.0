import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import type { RuleObject } from 'ant-design-vue/lib/form/interface';
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
  const getPasswordFormRule = computed(() => createRule('请输入密码'));
  const getSurePasswordFormRule = computed(() => createRule('请输入验证码'));

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const passwordFormRule = unref(getPasswordFormRule);
    const surePasswordFormRule = unref(getSurePasswordFormRule);

    const validateAccount = () => {
      return async (_: RuleObject, value: string) => {
        const len = value.length;
        if (!/^([\u4e00-\u9fa5a-z0-9.*!])+$/gi.test(value)) {
          return Promise.reject('用户名只能包含中英文、数字');
        }
        if (len < 2 || len > 20) {
          return Promise.reject('用户名长度在2~20之间');
        }
        if (/^([0-9])+$/gi.test(value)) {
          return Promise.reject('用户名不能是纯数字');
        }
        return Promise.resolve();
      };
    };

    const validateEmail = () => {
      return async (_: RuleObject, value: string) => {
        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(value)) {
          return Promise.reject('请输入正确的邮箱地址！');
        }
        return Promise.resolve();
      };
    };

    const validatePhone = () => {
      return async (_: RuleObject, value: string) => {
        if (!/^1[3-9]\d{9}$/gi.test(value)) {
          return Promise.reject('请输入正确的手机号！');
        }
        return Promise.resolve();
      };
    };

    return {
      username: [{ validator: validateAccount(), trigger: 'change' }],
      password: passwordFormRule,
      email: [{ validator: validateEmail(), trigger: 'change' }],
      code: surePasswordFormRule,
      phone: [{ validator: validatePhone(), trigger: 'change' }],
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
