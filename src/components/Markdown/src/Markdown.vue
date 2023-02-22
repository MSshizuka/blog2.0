<template>
  <div ref="wrapRef"></div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import { AesEncryption } from '/@/utils/cipher';
  import { cacheCipher } from '/@/settings/encryptionSetting';
  import { isProdMode } from '/@/utils/env';
  import {
    defineComponent,
    ref,
    unref,
    nextTick,
    watch,
    onBeforeUnmount,
    onDeactivated,
  } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { useModalContext } from '../../Modal';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  export default defineComponent({
    inheritAttrs: false,
    props: {
      height: { type: Number, default: 660 },
      value: { type: String, default: '' },
    },
    emits: ['change', 'get', 'update:value'],
    setup(props, { attrs, emit }) {
      const wrapRef = ref<ElRef>(null);
      const vditorRef = ref(null) as Ref<Nullable<Vditor>>;
      const initedRef = ref(false);
      const { createMessage } = useMessage();
      const userStore = useUserStoreWithOut();

      const modalFn = useModalContext();

      const valueRef = ref(props.value || '');

      watch(
        () => props.value,
        (v) => {
          if (v !== valueRef.value) {
            instance.getVditor()?.setValue(v);
          }
          valueRef.value = v;
        },
      );

      function init() {
        const wrapEl = unref(wrapRef) as HTMLElement;
        if (!wrapEl) return;
        const bindValue = { ...attrs, ...props };
        const insEditor = new Vditor(wrapEl, {
          theme: 'dark',
          lang: 'zh_CN',
          mode: 'sv',
          toolbarConfig: {
            hide: false,
          },
          fullscreen: {
            index: 820,
          },
          preview: {
            // mode: 'editor',
            hljs: {
              style: 'vim',
              lineNumber: true,
            },
            actions: [],
          },
          upload: {
            url: `${window.location.origin}/blog/api/v2/upload/article`,
            multiple: false,
            fieldName: 'file',
            max: 2 * 1024 * 1024,
            success: successFn,
            error: errorFn,
            setHeaders: () => ({
              Authorization: userStore.getToken,
            }),
          },
          input: (v) => {
            valueRef.value = v;
            emit('update:value', v);
            emit('change', v);
          },
          after: () => {
            nextTick(() => {
              modalFn?.redoModalHeight?.();
              insEditor.setValue(valueRef.value);
              vditorRef.value = insEditor;
              initedRef.value = true;
              emit('get', instance);
            });
          },
          blur: () => {
            //unref(vditorRef)?.setValue(props.value);
          },
          ...bindValue,
          cache: {
            enable: false,
          },
        });
      }

      const successFn = (editor: HTMLPreElement, msg: string) => {
        const res = JSON.parse(msg);
        if (isProdMode() && res.data) {
          // if (isProdMode() && false && res.data && res.data.data) {
          const key = cacheCipher.key;
          const iv = cacheCipher.iv;
          const encryption = new AesEncryption({ key, iv });
          res.data = JSON.parse(encryption.decryptByAES(res.data));
        }
        const str = `![](${res.data.url})`;
        editor.innerHTML += str;
      };

      const errorFn = (msg: string) => {
        createMessage.error(`上传失败，${msg}`);
      };

      const instance = {
        getVditor: (): Vditor => vditorRef.value!,
      };

      function destroy() {
        const vditorInstance = unref(vditorRef);
        if (!vditorInstance) return;
        try {
          vditorInstance?.destroy?.();
        } catch (error) {}
        vditorRef.value = null;
        initedRef.value = false;
      }

      onMountedOrActivated(init);
      onBeforeUnmount(destroy);
      onDeactivated(destroy);
      return {
        wrapRef,
        ...instance,
      };
    },
  });
</script>
