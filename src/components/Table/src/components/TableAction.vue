<template>
  <div :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <PopConfirmButton v-bind="action">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <template v-if="action.label">{{ action.label }}</template>
        </PopConfirmButton>
      </Tooltip>
      <PopConfirmButton v-else v-bind="action">
        <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
        <template v-if="action.label">{{ action.label }}</template>
      </PopConfirmButton>
      <Divider
        type="vertical"
        class="action-divider"
        v-if="divider && index < getActions.length - 1"
      />
    </template>
    <!-- 下拉菜单 -->
    <Dropdown
      :trigger="['hover']"
      :dropMenuList="getDropdownList"
      popconfirm
      v-if="dropDownActions && getDropdownList.length > 0"
    >
      <slot name="more"></slot>
      <a-button type="link" size="small" v-if="!$slots.more">
        <MoreOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed, toRaw, unref } from 'vue';
  import { MoreOutlined } from '@ant-design/icons-vue';
  import { Divider, Tooltip, TooltipProps } from 'ant-design-vue';
  import Icon from '/@/components/Icon/index';
  import { ActionItem, TableActionType } from '/@/components/Table';
  import { PopConfirmButton } from '/@/components/Button';
  import { Dropdown } from '/@/components/Dropdown';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useTableContext';
  import { isBoolean, isFunction, isString } from '/@/utils/is';
  import { propTypes } from '/@/utils/propTypes';
  import { ACTION_COLUMN_FLAG } from '../const';

  export default defineComponent({
    name: 'TableAction',
    components: { Icon, PopConfirmButton, Divider, Dropdown, MoreOutlined, Tooltip },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      divider: propTypes.bool.def(true), // 是否需要分割线 默认有
      outside: propTypes.bool,
      stopButtonPropagation: propTypes.bool.def(false),
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-action');
      let table: Partial<TableActionType> = {};
      if (!props.outside) {
        table = useTableContext();
      }

      /* 是否需要展示 */
      function isIfShow(action: ActionItem): boolean {
        const ifShow = action.ifShow;

        /* isShow不为boolean或函数 则默认返回true */
        let isIfShow = true;

        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(action);
        }
        return isIfShow;
      }

      /* 获取action数组数据 */
      const getActions = computed(() => {
        return (toRaw(props.actions) || [])
          .filter((action) => {
            return isIfShow(action);
          })
          .map((action) => {
            const { popConfirm } = action;
            return {
              getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
              type: 'link',
              size: 'small',
              ...action,
              ...(popConfirm || {}),
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
              enable: !!popConfirm,
            };
          });
      });

      // console.log('getActions', getActions.value);

      /* 获取下拉菜单 */
      const getDropdownList = computed((): any[] => {
        const list = (toRaw(props.dropDownActions) || []).filter((action) => {
          return isIfShow(action);
        });
        return list.map((action, index) => {
          const { label, popConfirm } = action;
          return {
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            text: label,
            divider: index < list.length - 1 ? props.divider : false,
          };
        });
      });

      /* 获取表格其他列对齐方式赋值到操作列  */
      const getAlign = computed(() => {
        const columns = (table as TableActionType)?.getColumns?.() || [];
        const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
        return actionColumn?.align ?? 'left';
      });

      function getTooltip(data: string | TooltipProps): TooltipProps {
        return {
          getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body, // table存在则渲染到表格内 否则 body
          placement: 'bottom',
          ...(isString(data) ? { title: data } : data),
        };
      }

      function onCellClick(e: MouseEvent) {
        if (!props.stopButtonPropagation) return; // 是否阻止冒泡
        const path = e.composedPath() as HTMLElement[]; // 当前目标元素的所有外层的html标签合集 最外层Window
        const isInButton = path.find((ele) => {
          return ele.tagName?.toUpperCase() === 'BUTTON';
        });
        // 如果其上有button对象则阻止冒泡
        isInButton && e.stopPropagation();
      }

      return {
        prefixCls,
        getActions,
        getDropdownList,
        getAlign,
        onCellClick,
        getTooltip,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-action';

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    .action-divider {
      display: table;
    }

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }

    button {
      display: flex;
      align-items: center;

      span {
        margin-left: 0 !important;
      }
    }

    button.ant-btn-circle {
      span {
        margin: auto !important;
      }
    }

    .ant-divider,
    .ant-divider-vertical {
      margin: 0 2px;
    }

    .icon-more {
      transform: rotate(90deg);

      svg {
        font-size: 1.1em;
        font-weight: 700;
      }
    }
  }
</style>
