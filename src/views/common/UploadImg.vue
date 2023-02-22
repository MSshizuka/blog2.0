<template>
  <div>
    <Upload
      v-model:file-list="fileList"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :action="props.action"
      :before-upload="beforeUpload"
      :headers="{ Authorization: userStore.getToken }"
      @change="handleChange"
    >
      <img
        v-if="props.initUrl"
        :src="status === 'beforeUpload' ? props.initUrl : imageUrl"
        alt="avatar"
        style="width: 100px; height: 100px; border-radius: 50%"
      />
      <div v-else>
        <loading-outlined v-if="loading" />
        <plus-outlined v-else />
        <div class="ant-upload-text">上传图片</div>
      </div>
    </Upload>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
  import { AesEncryption } from '/@/utils/cipher';
  import { cacheCipher } from '/@/settings/encryptionSetting';
  import { message, Upload } from 'ant-design-vue';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  const fileList = ref([]);
  const loading = ref<boolean>(false);
  const imageUrl = ref<string>('');
  const status = ref('beforeUpload');
  const userStore = useUserStoreWithOut();

  const emits = defineEmits(['queryUrl']);
  const props = defineProps({
    initUrl: { type: String as PropType<string>, default: '' },
    type: { type: String as PropType<string>, default: '' },
    action: { type: String as PropType<string>, default: '' },
  });

  /* 背景图片处理 */
  function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  }
  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (base64Url: string) => {
        status.value = 'afterUpload';
        imageUrl.value = base64Url;
        const key = cacheCipher.key;
        const iv = cacheCipher.iv;
        const encryption = new AesEncryption({ key, iv });
        const data = JSON.parse(encryption.decryptByAES(info.file.response.data));
        emits('queryUrl', { data, typeStr: props.type });
        loading.value = false;
      });
    }
    if (info.file.status === 'error') {
      loading.value = false;
      message.error('上传失败');
    }
  };

  //@ts-ignore
  const beforeUpload = (file: UploadProps['fileList'][number]) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   return message.error('只能上传jpg或png格式图片');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return message.error('图片大小必须在2M以内');
    }

    return true;
  };
</script>
