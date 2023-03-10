<template>
  <div :class="getClass" :style="getStyle">
    <div :class="`${prefixCls}-image-wrapper`" :style="getImageWrapperStyle" @click="openModal">
      <div :class="`${prefixCls}-image-mask`" :style="getImageWrapperStyle">
        <Icon
          icon="ant-design:cloud-upload-outlined"
          :size="getIconWidth"
          :style="getImageWrapperStyle"
          color="#d6d6d6"
        />
      </div>
      <img :src="sourceValue" v-if="sourceValue" alt="avatar" />
    </div>
    <a-button
      :class="`${prefixCls}-upload-btn`"
      @click="openModal"
      v-if="showBtn"
      v-bind="btnProps"
    >
      {{ btnText ? btnText : '选择图片' }}
    </a-button>

    <CopperModal
      @register="register"
      @upload-success="handleUploadSuccess"
      :uploadApi="uploadApi"
      :src="sourceValue"
    />
  </div>
</template>
<script lang="ts" name="CropperAvatar" setup>
  import { computed, CSSProperties, unref, ref, watchEffect, watch, PropType } from 'vue';
  import CopperModal from './CopperModal.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import type { ButtonProps } from '/@/components/Button';
  import Icon from '/@/components/Icon';

  const props = defineProps({
    width: { type: [String, Number], default: '200px' },
    value: { type: String },
    showBtn: { type: Boolean, default: true },
    btnProps: { type: Object as PropType<ButtonProps> },
    btnText: { type: String, default: '' },
    uploadApi: { type: Function as PropType<({ file: Blob, name: string }) => Promise<void>> },
    type: { type: String },
  });

  const emit = defineEmits(['update:value', 'change']);

  const sourceValue = ref(props.value || '');
  const { prefixCls } = useDesign('cropper-avatar');
  const [register, { openModal, closeModal }] = useModal();
  const { createMessage } = useMessage();

  const getClass = computed(() => [prefixCls]);

  const getWidth = computed(() => `${props.width}`.replace(/px/, '') + 'px');

  const getIconWidth = computed(() => parseInt(`${props.width}`.replace(/px/, '')) / 2 + 'px');

  const getStyle = computed((): CSSProperties => ({ width: unref(getWidth) }));

  const getImageWrapperStyle = computed(
    (): CSSProperties => ({ width: unref(getWidth), height: unref(getWidth) }),
  );

  watchEffect(() => {
    sourceValue.value = props.value || '';
  });

  watch(
    () => sourceValue.value,
    (v: string) => {
      emit('update:value', v);
    },
  );

  function handleUploadSuccess({ source, data }) {
    sourceValue.value = source;
    emit('change', { source, data: data.data, typeStr: props.type });
    createMessage.success('上传成功');
  }

  defineExpose({ openModal: openModal.bind(null, true), closeModal });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-cropper-avatar';

  .@{prefix-cls} {
    display: inline-block;
    text-align: center;

    &-image-wrapper {
      overflow: hidden;
      cursor: pointer;
      background: @component-background;
      border: 1px solid @border-color-base;
      border-radius: 50%;

      img {
        width: 100%;
      }
    }

    &-image-mask {
      opacity: 0%;
      position: absolute;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      border: inherit;
      background: rgb(0 0 0 / 40%);
      cursor: pointer;
      transition: opacity 0.4s;

      ::v-deep(svg) {
        margin: auto;
      }
    }

    &-image-mask:hover {
      opacity: 4000%;
    }

    &-upload-btn {
      margin: 10px auto;
    }
  }
</style>
