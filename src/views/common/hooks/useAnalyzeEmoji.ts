import { ref, computed, Ref } from 'vue';
import sgsList from '../emoji/sgs.json';
import biliList from '../emoji/2233.json';
import bunList from '../emoji/bun.json';
import { useScrollTo } from '/@/hooks/event/useScrollTo';

export default (content?: Ref<string>, OwORef?: Ref<HTMLElement | null>) => {
  const isShow = ref(false);
  const currentEmojiIndex = ref(0);
  const EmojiNameList = ['sgs', '2233', 'bun'];

  //编译表情替换成图片展示出来
  const handleEmoji = (content: string): string => {
    const str = content
      .replace(/((\<script [^>]+>)|(<img [^>]+>))/, '')
      .replace(/\[((sgs)|(bili)|(bun))-[\u4e00-\u9fa5]+\]/g, (args: string): string => {
        const res = [...sgsList, ...biliList, ...bunList].filter((item) => args === item.title)[0];
        return res
          ? `<img style="display: inline;margin: 0 2px;max-width:40px;max-height:40px" src="${res.url}"/>`
          : '';
      });
    return str;
  };

  /* 回复内容 */
  const EmojiList = computed(() => {
    switch (currentEmojiIndex.value) {
      case 0:
        return sgsList;
      case 1:
        return biliList;
      case 2:
        return bunList;
      default:
        return sgsList;
    }
  });

  /* emoji显隐 */
  const toggle = () => {
    isShow.value = !isShow.value;
  };

  /* 切换emoji */
  const changeTab = (index: number) => {
    if (currentEmojiIndex.value === index) return;
    const { start } = useScrollTo({ el: OwORef?.value, to: 0, duration: 100 });
    start();
    currentEmojiIndex.value = index;
  };

  /* 选择表情 */
  const choseEmoji = (inner: string) => {
    if (content) {
      content.value += inner;
    }
    toggle();
  };

  /* 点击外部关闭表情弹框 */
  const handleClickOutside = () => {
    isShow.value = false;
  };

  return {
    isShow,
    currentEmojiIndex,
    EmojiNameList,
    handleEmoji,
    EmojiList,
    toggle,
    changeTab,
    choseEmoji,
    handleClickOutside,
  };
};
