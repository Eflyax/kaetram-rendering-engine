export default class Star extends PIXI.Graphics {

	constructor() {
			super();

			this.visible = true;
			this.beginFill(0x666666);
			this.drawStar(0, 0, 5, 10, 3);
	}
}
