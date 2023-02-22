import defaultImg from '/@/assets/images/logo.jpg';

export const useErrorImg = () => {
  const handleImg = (e: Event) => {
    // @ts-ignore
    e.target.src = defaultImg;
  };

  return { handleImg };
};
