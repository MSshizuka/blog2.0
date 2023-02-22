<template>
  <div class="w-full h-full flex justify-center items-center page-wrapper relative z-index-2">
    <div class="w-full header-wrapper">
      <AppLogo :class="`site-logo`" />
      <div class="absolute right-4 set-icon">
        <SettingDrawer />
      </div>
    </div>

    <div
      v-if="action === 'modify' || action === 'modifyPassword'"
      class="absolute flex justify-center items-center rounded w-80 h-135 form-box"
    >
      <div class="w-full flex flex-col items-center">
        <VerifyEmail v-if="action === 'modify'" @modify="setAction" ref="verifyEmailRef" />
        <ModifyPassword
          v-if="action === 'modifyPassword'"
          @modify="setAction"
          :current-email="currentEmail"
          :current-phone="currentPhone"
        />
      </div>
    </div>

    <div class="relative rounded bg-white/80 w-80 sm:w-160 h-110 container" v-else>
      <div
        class="absolute flex justify-center items-center -top-13 left-0 sm:left-5 rounded z-index-2 w-80 h-135 form-box"
        :class="action === 'login' ? 'left' : action === 'register' && !getIsMobile ? 'right' : ''"
      >
        <div class="w-full flex flex-col items-center">
          <RegisterForm v-if="action === 'register'" @login="setAction" />
          <LoginForm v-else @modify="setAction" />
        </div>
      </div>
      <div
        class="absolute w-1/2 flex flex-col justify-center items-center text-center con-box"
        :class="action === 'login' ? 'right' : 'left'"
        v-if="['login', 'register'].includes(action) && !getIsMobile"
      >
        <h2 class="font-bold text-2xl text-center mb-2 text-violet-400 tracking-widest">
          欢迎来到おうの博客
        </h2>
        <img :src="gif" alt="" class="w-39 h-39 my-10 mx-auto" />
        <p class="text-violet-400 text-xs tracking-wide text-center">{{ desMap.tipStr }}</p>
        <button @click="toggleAction" class="text-violet-300">{{ desMap.buttonStr }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import gif from '/@/assets/images/cat.gif';
  import LoginForm from './LoginForm.vue';
  import RegisterForm from './RegisterForm.vue';
  import VerifyEmail from './VerifyEmail.vue';
  import ModifyPassword from './ModifyPassword.vue';

  import { AppLogo } from '/@/components/Application';
  import { computed, ref } from 'vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import SettingDrawer from '/@/layouts/default/setting/index.vue';

  import { useThemeStore } from '/@/store/modules/theme';
  import { useAppStore } from '/@/store/modules/app';
  const { getIsMobile } = useAppInject();

  const appStore = useAppStore();
  const useTheme = useThemeStore();
  const verifyEmailRef = ref();

  const background = computed(() => {
    const curImg =
      useTheme.getThemeMap[
        `${appStore.getProjectConfig.themeName}-avatar${getIsMobile.value ? '-mobile' : ''}`
      ];
    return `url(${curImg}) no-repeat`;
  });

  const currentEmail = ref('');
  const currentPhone = ref('');

  const action = ref('login');
  const toggleAction = () => {
    action.value = action.value === 'login' ? 'register' : 'login';
  };

  const setAction = (a: string) => {
    const VerifyComp = verifyEmailRef.value;
    if (a === 'modifyPassword' && VerifyComp) {
      const { isPhoneWay, formData } = VerifyComp;
      console.log('isPhoneWay formData===>', isPhoneWay, formData);
      isPhoneWay ? (currentPhone.value = formData.phone) : (currentEmail.value = formData.email);
    }
    action.value = a;
  };

  const desMap = computed(() => {
    return {
      buttonStr: action.value === 'login' ? '去注册' : '去登录',
      tipStr: action.value === 'login' ? '没有账号？' : '已有帐号',
    };
  });
</script>

<style lang="less" scoped>
  .site-logo {
    position: absolute;
    font-size: 14px;
    top: 14px;
    left: 0px;
    color: rgba(255, 255, 255);
  }

  .page-wrapper {
    background: v-bind(background);
    background-size: cover;

    .header-wrapper {
      position: fixed;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 48px;
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);

      .set-icon {
        line-height: 48px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .container {
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  }

  .form-box {
    background: linear-gradient(
      to right,
      #b5eeba67,
      #756aee62,
      #df827881,
      #c77be780,
      #89ebe170,
      #e2e27d94
    );
    background-size: 500%;
    animation: gradual 17s linear infinite;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.5s ease-in-out;
  }

  .form-box.right {
    transform: translateX(80%);
  }

  .form-box.left {
    transform: translateX(0%);
  }

  .con-box {
    top: 50%;
    transform: translateY(-50%);
  }

  .con-box.left {
    left: -2%;
  }

  .con-box.right {
    right: -2%;
  }

  .con-box button {
    margin-top: 3%;
    background-color: #fff;
    border: 1px solid #d3b7d8;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;
  }

  .con-box button:hover {
    background-color: #d3b7d8;
    color: #fff;
  }

  .hidden {
    display: none;
    transition: all 0.5s;
  }
</style>
