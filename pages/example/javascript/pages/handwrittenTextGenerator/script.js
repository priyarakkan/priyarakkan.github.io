const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const fontSizeSlider = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Initial font size
let fontSize = parseInt(fontSizeSlider.value);

// Update font size display
fontSizeSlider.addEventListener('input', () => {
  fontSize = parseInt(fontSizeSlider.value);
  fontSizeValue.textContent = fontSize;
});

// Generate handwritten text
generateBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  const font = fontSelect.value;
  if (!text) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set text style
  ctx.fillStyle = '#fff';
  ctx.font = `${fontSize}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Split text into multiple lines if needed
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.2;
  const startY = canvas.height / 2 - ((lines.length - 1) / 2) * lineHeight;

  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });
});

// Reset canvas
resetBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  textInput.value = '';
  fontSelect.value = "'Alex Brush', cursive";
  fontSizeSlider.value = 40;
  fontSizeValue.textContent = 40;
});

// Download canvas as image
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'handwritten_text.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
