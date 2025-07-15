const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let angle = 0;
let frame = 0;
let regions = [];
let scale = 1;
let offsetX = 0;
let offsetY = 0;

// Intentar reproducir la música incluso si el navegador bloquea el autoplay
const music = document.getElementById("bg-music");
music.volume = 0.5;
document.body.addEventListener("click", () => {
  music.play().catch(e => console.log("Autoplay bloqueado"));
});

// Cargar el JSON
fetch('rosas.json')
  .then(response => response.json())
  .then(data => {
    regions = data;
    prepareScaleAndOffset();
    animate();
  });

function prepareScaleAndOffset() {
  const allPoints = regions.flatMap(r => r.contour);
  const xs = allPoints.map(p => p[0]);
  const ys = allPoints.map(p => p[1]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  scale = Math.min(600 / width, 600 / height);
  offsetX = (minX + maxX) / 2;
  offsetY = (minY + maxY) / 2;
}

function drawRegion(region) {
  const color = `rgb(${region.color[0]}, ${region.color[1]}, ${region.color[2]})`;
  ctx.fillStyle = color;
  ctx.beginPath();

  region.contour.forEach((point, index) => {
    let x = (point[0] - offsetX) * scale + canvas.width / 2;
    let y = (offsetY - point[1]) * scale + canvas.height / 2;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.closePath();
  ctx.fill();
}

function animate() {
  ctx.save();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  for (let i = 0; i < frame && i < regions.length; i++) {
    drawRegion(regions[i]);
  }

  ctx.restore();

  if (frame < regions.length) frame++;
  angle += 0.003;

  requestAnimationFrame(animate);
}
