import { useScrollTo } from '/@/hooks/event/useScrollTo';

export default () => {
  const goTop = (to = 0, duration = 200) => {
    const target = document.querySelector('.sup-layout-content')!;
    const { start } = useScrollTo({ el: target, to, duration });
    start();
  };

  return {
    goTop,
  };
};
