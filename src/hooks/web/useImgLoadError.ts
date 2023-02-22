import defaultImg from '/@/assets/images/logo.jpg';

export default () => {
  const handleImg = (e) => {
    e.target.src = defaultImg;
  };
  return { handleImg };
};
