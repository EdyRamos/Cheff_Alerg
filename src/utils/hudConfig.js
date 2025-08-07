export const getHUDConfig = (width, height, chefSize = 0) => {
  const base = Math.min(width, height);
  const margin = base * 0.02;
  const iconSize = base * 0.04;
  const cardWidth = base * 0.75;
  const cardHeight = base * 0.25;
  const defaultY = height - cardHeight - margin;
  let tipY = defaultY;
  if (chefSize) {
    const availableAboveChef = height - chefSize - margin * 2;
    tipY = Math.min(defaultY, availableAboveChef - cardHeight / 2 - margin);
    tipY = Math.max(cardHeight / 2 + margin, tipY);
  }
  return {
    margin,
    iconSize,
    textStyle: { fontSize: `${iconSize}px`, fill: '#fff' },
    tip: {
      cardWidth,
      cardHeight,
      y: tipY,
    },
  };
};
