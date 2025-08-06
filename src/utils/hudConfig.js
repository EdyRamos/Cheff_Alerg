export const getHUDConfig = (width, height) => {
  const base = Math.min(width, height);
  const margin = base * 0.02;
  const iconSize = base * 0.04;
  return {
    margin,
    iconSize,
    textStyle: { fontSize: `${iconSize}px`, fill: '#fff' },
    tip: {
      cardWidth: base * 0.75,
      cardHeight: base * 0.25,
      y: height - base * 0.25 - margin,
    },
  };
};
