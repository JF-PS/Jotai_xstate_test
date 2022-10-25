//"https://100k-faces.glitch.me/random-image";

const getRandomFace = () => {
  fetch('https://100k-faces.glitch.me/random-image').then((response) => {
    return response?.url;
  });

  return 'https://100k-faces.glitch.me/random-image';
};

export default getRandomFace;
