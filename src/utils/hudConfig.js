export const getHUDConfig = (width, height) => {
  const margin = width * 0.02;
  const iconSize = width * 0.04;
  return {
    margin,
    iconSize,
    textStyle: { fontSize: `${iconSize}px`, fill: '#fff' },
    tip: {
      cardWidth: width * 0.375,
      cardHeight: height * 0.166,
      y: height - height * 0.166 - margin,
    },
  };
};
