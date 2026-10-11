import * as THREE from 'three';

export function createBillboardSprite(title, subtitle, borderColor = '#ec4899', bgColor = 'rgba(15, 23, 42, 0.92)') {
  if (typeof document === 'undefined') {
    return new THREE.Group();
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = bgColor;
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(12, 12, 488, 232, 28);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 14;
    ctx.stroke();
  } else {
    ctx.fillRect(12, 12, 488, 232);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(12, 12, 488, 232);
  }

  // Title
  ctx.fillStyle = borderColor;
  ctx.font = 'bold 60px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 85);

  // Subtitle
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(subtitle, 256, 175);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(3.2, 1.6, 1.0);
  return sprite;
}
