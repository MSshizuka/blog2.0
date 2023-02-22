<template>
  <Layout :class="prefixCls">
    <BackTop v-if="getUseOpenBackTop" :target="getTarget" />
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />
    <Layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <div class="to-top" @click="goTop" ref="backToRef"></div>
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
  import { computed, unref, ref, onUnmounted } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { BackTop } from 'ant-design-vue';

  import LayoutHeader from './header/index.vue';
  import LayoutSideBar from './sider/index.vue';
  import LayoutMultipleHeader from './header/MultipleHeader.vue';
  import LayoutContent from './content/index.vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useThrottleFn } from '@vueuse/shared';
  import { onMounted } from 'vue';
  import { useScrollTo } from '/@/hooks/event/useScrollTo';

  import { useThemeStore } from '/@/store/modules/theme';

  import { useAppStore } from '/@/store/modules/app';
  const appStore = useAppStore();
  const useTheme = useThemeStore();
  const { getIsMobile } = useAppInject();

  const background = computed(() => {
    const curImg =
      useTheme.getThemeMap[
        `${appStore.getProjectConfig.themeName}-avatar${getIsMobile.value ? '-mobile' : ''}`
      ];
    return `url(${curImg}) no-repeat`;
  });

  const backToRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    window.addEventListener('scroll', useThrottleFn(showBackTop, 300), true);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', showBackTop, true);
  });

  const showBackTop = (e) => {
    const target: any = e?.target;
    const isTarget = target.className.includes(`sup-layout-content`);
    if (!isTarget || !backToRef.value) return;
    const scrollTop = target.scrollTop;
    const wHeight = document.documentElement.clientHeight;
    if (scrollTop > Math.floor(1.6 * wHeight)) {
      backToRef.value.style.display = 'block';
    } else {
      backToRef.value.style.display = 'none';
    }
  };

  const goTop = () => {
    let index = 0;
    const el = document.querySelector('.to-top') as HTMLElement;
    if (!el) return;
    const timer = setInterval(() => {
      index++;
      el.style['background-position-x'] = -(143 * index + 40) + 'px';
      if (index == 4) {
        el.classList.add('transition', 'fly');
      }
      if (index == 6) {
        index = 0;
        clearInterval(timer);
        const initTimer = setTimeout(() => {
          el.classList.remove('transition', 'fly');
          el.style['background-position'] = '-40px -44px';
          clearTimeout(initTimer);
        }, 500);
        const target = document.querySelector('.sup-layout-content')!;
        const { start } = useScrollTo({ el: target, to: 0, duration: 500 });
        start();
      }
    }, 120);
  };

  const layoutClass = computed(() => {
    let cls: string[] = ['ant-layout'];
    if (unref(getIsMixSidebar) || unref(getShowMenu)) {
      cls.push('ant-layout-has-sider');
    }
    return cls;
  });
  const { prefixCls } = useDesign('default-layout');
  const { getShowFullHeaderRef } = useHeaderSetting();
  const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();
  const getTarget = () => document.body;
  const { getUseOpenBackTop } = useRootSetting();
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;

    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      height: 100vh;
      overflow: auto;
      background: v-bind(background);
      background-size: cover;
      // background-attachment: fixed;
    }
  }

  .to-top {
    position: fixed;
    z-index: 999;
    display: none;
    bottom: 100px;
    right: 20px;
    transform: translateY(0);
    width: 62px;
    height: 85px;
    margin-left: 602px;
    cursor: pointer;
    background-image: url('/@/assets/images/space-to-top.png');
    background-position: -40px -44px;
  }

  .to-top.transition {
    transition: transform 0.3s ease-in;
  }

  .to-top.fly {
    transform: translateY(-1000px);
  }
</style>
