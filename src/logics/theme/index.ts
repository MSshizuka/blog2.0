import { useSakura, useRain, useSnowy } from '/@/utils/domUtils';

/* 修改动效开关 */
export const toggleCanvas = (flag: boolean): void => {
  console.log('toggleCanvas===>', flag);
  const random = Math.random() * 10;
  if (flag) {
    const currentHooks = random <= 3 ? useRain : random <= 8 ? useSakura : useSnowy;
    const canvas = document.querySelector('canvas');
    if (canvas) return;
    currentHooks(`#app`);
  } else {
    const canvas = document.querySelector('canvas')!;
    canvas?.remove();
  }
};
