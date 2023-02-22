<template>
  <BasicModal v-bind="$attrs" @register="register" title="举报" @ok="handleOk" @cancel="initRadio">
    <div v-for="item in list" :key="item.label" class="p-2">
      <span class="text-stone-400">{{ item.label }}</span>
      <br />
      <RadioGroup v-model:value="reportValue">
        <Radio v-for="tip in item.values" :key="tip.label" :value="tip.value">
          {{ tip.label }}
        </Radio>
      </RadioGroup>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Radio } from 'ant-design-vue';
  import { shieldComment } from '/@/api/message/index';

  const list = [
    {
      label: '违反法律法规',
      values: [
        { label: '违法违规', value: '11' },
        { label: '色情', value: '12' },
        { label: '低俗', value: '13' },
        { label: '赌博诈骗', value: '14' },
      ],
    },
    {
      label: '谣言类不实信息',
      values: [
        { label: '涉政谣言', value: '21' },
        { label: '疫情谣言', value: '22' },
        { label: '涉社会事件谣言', value: '23' },
        { label: '虚假不实信息', value: '24' },
      ],
    },
    {
      label: '侵犯个人权益',
      values: [
        { label: '人身攻击', value: '31' },
        { label: '侵犯隐私', value: '32' },
      ],
    },
    {
      label: '有害社区环境',
      values: [
        { label: '垃圾广告', value: '41' },
        { label: '青少年不良信息', value: '42' },
        { label: '其他', value: '43' },
      ],
    },
  ];

  const RadioGroup = Radio.Group;

  const reportValue = ref('');

  const emits = defineEmits(['refreshList']);

  const { createMessage } = useMessage();

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });
  const modelRef = ref<Recordable>({});

  /* 初始化单选选项 */
  const initRadio = () => {
    reportValue.value = '';
  };

  const onDataReceive = (data) => {
    modelRef.value = { id: data.id };
  };
  const handleOk = async () => {
    try {
      const { message } = await shieldComment({ id: modelRef.value.id, value: reportValue.value });
      createMessage.success(message);
    } finally {
      emits('refreshList');
      initRadio();
      closeModal();
    }
  };
</script>
