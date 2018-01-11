const defaults = {
  family: 'sans-serif',
  fontSize: '12px',
};

const MeasureText = (text, style) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const font = style.fontFamily ? style.fontFamily : defaults.family;
  const fontSize = style.fontSize ? style.fontSize : style.fontSize;
  context.font = `${fontSize} ${font}`;
  return context.measureText(text).width;
};
export default MeasureText;
