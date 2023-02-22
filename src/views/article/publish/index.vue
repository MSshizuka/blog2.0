<template>
  <div class="p-2 my-5 w-3/4 mx-auto bg-dark-700/40 rounded">
    <div class="bg-white rounded mb-5 p-4">
      请输入标题：
      <a-input
        v-model:value="title"
        placeholder="请输入标题，不超过30个字"
        style="max-width: 400px; margin-bottom: 20px"
        allowClear
      />
      <br />
      类型：
      <RadioGroup v-model:value="subject" class="subject">
        <Radio value="article"> 文章 </Radio>
        <Radio value="relife"> 生活点滴 </Radio>
      </RadioGroup>
      <br />
      请选择分类：
      <a-cascader
        v-model:value="typeList"
        :field-names="{ label: 'name', value: 'id' }"
        :options="options"
        placeholder="请选择分类"
      />
      <div class="flex w-full mt-6">
        <p class="w-30"> 请上传背景图： </p>
        <Upload
          v-model:file-list="fileList"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :headers="{ Authorization: userStore.getToken }"
          action="/blog/api/v2/upload/article"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading" />
            <plus-outlined v-else />
            <div class="ant-upload-text">Upload</div>
          </div>
        </Upload>
      </div>
    </div>
    <MarkDown
      v-model:value="content"
      @change="handleContentChange"
      ref="markDownRef"
      placeholder="请开始编写您的技术文档。。。"
    />
    <div class="w-full mt-8 text-right">
      <a-button class="mx-5" @click="cancel">取消</a-button>
      <a-button type="primary" @click="publish">发布</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { categoryTreeModel } from '/@/api/category/model/indexModel';
  import { getCategory } from '/@/api/category';
  import { createArticle } from '/@/api/article';
  import { MarkDown, MarkDownActionType } from '/@/components/Markdown';
  import { Cascader, message, Upload, Radio } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
  import { AesEncryption } from '/@/utils/cipher';
  import { cacheCipher } from '/@/settings/encryptionSetting';
  import { isProdMode } from '/@/utils/env';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  const key = cacheCipher.key;
  const iv = cacheCipher.iv;
  const encryption = new AesEncryption({ key, iv });
  const userStore = useUserStoreWithOut();

  const ACascader = Cascader;
  const RadioGroup = Radio.Group;

  const { createMessage } = useMessage();
  const fileList = ref([]);
  const loading = ref<boolean>(false);
  const subject = ref('');
  const imageUrl = ref<string>('');
  const realImgUrl = ref<string>('');

  const title = ref('');
  const typeList = ref<Array<string>>([]);
  const options = ref<categoryTreeModel>([]);

  const router = useRouter();
  const markDownRef = ref<Nullable<MarkDownActionType>>(null);
  const content = ref(``);

  function handleContentChange(v: string) {
    content.value = v;
  }

  const createCategory = async () => {
    options.value = await getCategory();
  };

  createCategory();

  const validateValue = () => {
    console.log('title.value', title.value);
    console.log('\ncontent.value', content.value);
    console.log('\nrealImgUrl.value', realImgUrl.value);
    console.log('\ntypeList.value', typeList.value);
    if (
      !title.value ||
      !content.value ||
      !subject.value ||
      !realImgUrl.value ||
      typeList.value.length <= 1
    ) {
      return createMessage.error('标题、类型、分类、背景图和内容均不能为空');
    }
    return true;
  };

  const publish = async () => {
    if (validateValue() !== true) return;
    const { message } = await createArticle({
      title: title.value,
      content: content.value,
      type: typeList.value[0],
      subType: typeList.value[1],
      imageUrl: realImgUrl.value,
      subject: subject.value,
    });
    createMessage.success(message);
    router.replace('/dashboard');
  };
  const cancel = () => {
    router.back();
  };

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
        imageUrl.value = base64Url;
        if (isProdMode()) {
          // if (isProdMode() && false) {
          realImgUrl.value = JSON.parse(encryption.decryptByAES(info.file.response.data)).url;
        } else {
          realImgUrl.value = info.file.response.data.url;
        }
        console.log('图片真实路径======>', realImgUrl.value);
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
    //   message.error('只能上传jpg或png格式图片');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return message.error('图片大小必须在2M以内');
    }
    return true;
  };
</script>

<style lang="less" scoped>
  .avatar-uploader > .ant-upload {
    width: 168px;
    height: 128px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .subject {
    margin-bottom: 20px;
    vertical-align: top;
  }
</style>
