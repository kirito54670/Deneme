const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const app = express();

// Fontları yükle (opsiyonel)
try {
  registerFont(path.join(dirname, 'fonts', 'Roboto-Regular.ttf'), { family: 'Roboto' });
  registerFont(path.join(dirname, 'fonts', 'Roboto-Bold.ttf'), { family: 'Roboto', weight: 'bold' });
  console.log('Roboto Font Başarıyla Yüklendi');
} catch (error) {
  console.log('Fontlar bulunamadı, sistem fontları kullanılacak.');
}

// API endpoint
app.get('/api/card', async (req, res) => {
  try {
    const { kullanici, itibar, arkaplan, avatar } = req.query;

    if (!kullanici  !itibar  !arkaplan || !avatar) {
      return res.status(400).json({
        success: false,
        error: 'kullanici, itibar, arkaplan, avatar parametrelerini boş bırakmaman lazım!'
      });
    }

    const width = 500;
    const height = 160;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
[01:29]
ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    await drawSimpleCard(ctx, width, height, arkaplan, avatar, kullanici, itibar);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '');

    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);

  } catch (error) {
    console.error('[ERROR]: Profil Kartı Oluşturulamadı: ', error);
    res.status(500).json({ error: 'Resim Oluşturulamadı!' });
  }
});

// Fonksiyonlar
async function drawSimpleCard(ctx, width, height, backgroundUrl, avatarUrl, kullanici, itibar) {
  await drawBackground(ctx, width, height, backgroundUrl);
  await drawAvatar(ctx, avatarUrl);
  drawText(ctx, kullanici, itibar);
}

async function drawBackground(ctx, width, height, backgroundUrl) {
  try {
    const bgImage = await loadImage(backgroundUrl);
    const scale = Math.max(width / bgImage.width, height / bgImage.height);
    const scaledWidth = bgImage.width scale;
    const scaledHeight = bgImage.height * scale;
    const x = (width - scaledWidth) / 2;
    const y = (height - scaledHeight) / 2;

    ctx.drawImage(bgImage, x, y, scaledWidth, scaledHeight);

    const overlay = ctx.createLinearGradient(0, 0, width, 0);
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
  } catch (error) {
    drawDefaultBackground(ctx, width, height);
  }
}
[01:29]
function drawDefaultBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a0033');
  gradient.addColorStop(0.5, '#330066');
  gradient.addColorStop(1, '#1a0033');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

async function drawAvatar(ctx, avatarUrl) {
  const avatarSize = 110;
  const avatarX = 25;
  const avatarY = 25;

  ctx.beginPath();
  ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 3, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  try {
    const avatarImage = await loadImage(avatarUrl);
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
  } catch (error) {
    drawDefaultAvatar(ctx, avatarX, avatarY, avatarSize);
  }
}

function drawDefaultAvatar(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
  ctx.fillStyle = '#cccccc';
  ctx.fill();
  ctx.fillStyle = '#999999';
  ctx.font = '45px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('', x + size/2, y + size/2);
}

function drawTextWithShadow(ctx, text, x, y, shadowColor = 'rgba(0,0,0,0.6)', shadowBlur = 4) {
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText(text, x, y);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function drawText(ctx, kullanici, itibar) {
  const textStartX = 155;
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  drawTextWithShadow(ctx, kullanici, textStartX, 40);
[01:29]
ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 26px Arial, sans-serif';
  drawTextWithShadow(ctx, 'İtibar', textStartX, 88);

  ctx.fillStyle = 'white';
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.textBaseline = 'top';
  drawTextWithShadow(ctx, : ${itibar}, textStartX + 70, 85);
}

// Render uyumlu port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server ${PORT} portunda çalışıyor);
});