<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" @error="handleImg" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.username }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem key="profile" text="个人中心" icon="codicon:account" />
        <MenuItem key="logout" text="退出" icon="ion:power-outline" />
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts" setup name="UserDropdown">
  // components
  import { Dropdown, Menu } from 'ant-design-vue';
  import { computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useGo } from '/@/hooks/web/usePage';
  import useImgLoadError from '/@/hooks/web/useImgLoadError';
  const { handleImg } = useImgLoadError();
  type MenuEvent = 'logout' | 'profile';

  const go = useGo();

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  });
  const { prefixCls } = useDesign('header-user-dropdown');
  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { username = '', avatar, id } = userStore.getUserInfo || {};
    return { username, id, avatar };
  });

  async function handleMenuClick(e: { key: MenuEvent }) {
    switch (e.key) {
      case 'logout':
        await userStore.logout();
        break;
      case 'profile':
        go('/profile/index');
        break;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      object-fit: cover;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: transparent;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
        color: rgba(255, 255, 255, 0.65);
      }
    }
  }
</style>
