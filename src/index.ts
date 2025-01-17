
import { Container, autoDetectRenderer, Graphics, Text, Renderer } from "pixi.js";

class GPUCanvas extends HTMLElement {
    public canvas: HTMLCanvasElement;
    public renderer: Renderer | null = null;
    public graphics: Graphics | null = null;
    public stage: Container | null = null;
    public width: number = 300;
    public height: number = 200;

    public lineWidth: number = 1;

    private _renderPending: boolean = false;
    private _initPromise: Promise<void> | null = null;
    private _ready: boolean = false;

    constructor() {
        super();

        this.canvas = document.createElement('canvas');
        this.appendChild(this.canvas);
	}

	async _initialize() {
		this.renderer = await autoDetectRenderer({
			width: this.width,
			height: this.height,
			antialias: false,
			backgroundAlpha: 0,
			clearBeforeRender: true,
			view: this.canvas,
		});

		this.stage = new Container();
        this.graphics = new Graphics();
        this.stage.addChild(this.graphics);

        this._ready = true;
        this.dispatchEvent(new CustomEvent('ready'));
    }

    get fillStyle() {
        return this.graphics!.fillStyle;
    }
    set fillStyle(value) {
        this.graphics!.fillStyle = value;
    }

    get strokeStyle() {
        return this.graphics!.strokeStyle;
    }
    set strokeStyle(value) {
        this.graphics!.strokeStyle = value;
    }

    getContext(contextId: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer') {
        if (contextId === '2d') {
            return this;
        }
        throw new Error('getContext not implemented for ' + contextId);
    }

    connectedCallback() {
        this.width = this.getAttribute('width') ? parseInt(this.getAttribute('width')!) : 300;
        this.height = this.getAttribute('height') ? parseInt(this.getAttribute('height')!) : 200;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.style.display = 'block';
        this._initPromise = this._initialize();
    }

	async ready() {
        if (this._ready) return Promise.resolve();
        if (this._initPromise) await this._initPromise;
        return new Promise(resolve => {
            this.addEventListener('ready', resolve, { once: true });
        });
    }

    clear() {
        this.assertReady();
        this.graphics!.clear();
    }

    assertReady(){
        if(!this._ready) {
            throw new Error('Canvas not ready, await ready() before usage');
        }
    }

    beginPath() {
        this.assertReady();
        this.graphics!.beginPath();
    }

    closePath() {
        this.assertReady();
        this.graphics!.closePath();
    }

    moveTo(x: number, y: number) {
        this.assertReady();
        this.graphics!.moveTo(x, y);
    }

    lineTo(x: number, y: number) {
        this.assertReady();
        this.graphics!.lineTo(x, y);
        this.deferRender();
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
        this.assertReady();
        this.graphics!.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        this.deferRender();
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
        this.assertReady();
        this.graphics!.quadraticCurveTo(cpx, cpy, x, y);
        this.deferRender();
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean = false) {
        this.assertReady();
        this.graphics!.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        this.deferRender();
    }

    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean = false) {
        this.assertReady();
        // mismatch with pixi.js
        this.graphics!.ellipse(x, y, radiusX, radiusY);
        this.deferRender();
    }

    rect(x: number, y: number, width: number, height: number) {
        this.assertReady();
        this.graphics!.rect(x, y, width, height);
        this.deferRender();
    }

    roundRect(x: number, y: number, width: number, height: number, radius: number) {
        this.assertReady();
        this.graphics!.roundRect(x, y, width, height, radius);
        this.deferRender();
    }

    fill(){
        this.assertReady();
        this.graphics!.fill();
        this.deferRender();
    }

    stroke(){
        this.assertReady();
        this.graphics!.stroke({
            color: this.strokeStyle.color,
            width: this.lineWidth,
        });
        this.deferRender();
    }

    attributeChangedCallback(name: string, oldValue: number, newValue: number) {
        if (oldValue !== newValue) {
            if (name === 'width') {
                this.canvas.width = newValue;
            }
            if (name === 'height') {
                this.canvas.height = newValue;
            }
        }
    }

    deferRender() {
        if(this._renderPending) return;

        this.assertReady();

        this._renderPending = true;
        queueMicrotask(this.render);
    }
    render = () => {
        this._renderPending = false;
        this.renderer!.render(this.stage!);
    }
}

customElements.define('gpu-canvas', GPUCanvas);
