Simple drop-in GL / GPU replacement for the CanvasRenderingContext2.

## Usage

```javascript
const canvas = document.createElement('gpu-canvas');
await canvas.ready(); // we need to wait for the canvas to be ready
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);
```

## Live Example
[GPU Canvas / HTML Canvas comparison](https://eriksom.github.io/gpu-canvas/example/)

## Development

```bash
npm install
npm run dev
```
Open `http://localhost:PORT/example` in your browser.
