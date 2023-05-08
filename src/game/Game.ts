import Mecha from "../dragonBones/src/Mecha";
import Robot from "../dragonBones/src/Robot";

const
	CANVAS_WIDTH = 1200,
	CANVAS_HEIGHT = 700;

export class Game extends PIXI.Application {

	private moveArea: PIXI.Rectangle = new PIXI.Rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	constructor() {
		super({
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			backgroundColor: 0x000000,
			autoStart: true,
			sharedTicker: true,
			sharedLoader: true,
		});

		// mecha - reexported
		PIXI.loader.add('resource/a/mecha_1004d_ske.json');
		PIXI.loader.add('resource/a/mecha_1004d_tex.json');
		PIXI.loader.add('resource/a/mecha_1004d_tex.png');

		//
		PIXI.loader.add('resource/mecha_1502b/mecha_1502b_ske.json');
		PIXI.loader.add('resource/mecha_1502b/mecha_1502b_tex.json');
		PIXI.loader.add('resource/mecha_1502b/mecha_1502b_tex.png');

		PIXI.loader.once('complete', (
			loader: PIXI.loaders.Loader,
			resources: dragonBones.Map<PIXI.loaders.Resource>,
		) => {
			//
			// Mecha
			// this.mecha = new Mecha(
			// 	resources['resource/a/mecha_1004d_ske.json'].data,
			// 	resources['resource/a/mecha_1004d_tex.json'].data,
			// 	resources['resource/a/mecha_1004d_tex.png'].texture,
			// 	'mecha_1004d'
			// );
			// this.mecha.x = 100.0;
			// this.mecha.y = 250.0;
			// this.mecha.setMoveable(true);
			// this.stage.addChild(this.mecha);
			//
			// Robot
			this.robot = new Robot(
				resources['resource/mecha_1502b/mecha_1502b_ske.json'].data,
				resources['resource/mecha_1502b/mecha_1502b_tex.json'].data,
				resources['resource/mecha_1502b/mecha_1502b_tex.png'].texture,
				'mecha_1502b'
			);
			this.robot.x = 300;
			this.robot.y = 300;
			this.robot.setMoveable(true);
			this.stage.addChild(this.robot);
			this.stage.on(
				'mousemove',
				(event: PIXI.interaction.InteractionEvent) => this.robot.mouseMove(event),
				this
			);
		});

		this.stage.interactive = true;
		this.stage.hitArea = this.screen;
		this.stage.on('touchstart', this.touchHandler, this);
		this.stage.on('touchmove', this.touchHandler, this);
		this.stage.on('mousedown', this.touchHandler, this);

		let drag: boolean = false;
		// this.stage.on('mousedown', () => drag = true, this);
		// this.stage.on('mouseup', () => drag = false, this);
		this.stage.on('mousemove', (e: PIXI.interaction.InteractionEvent) => drag && this.touchHandler(e), this);

		document.body.appendChild(this.view);

		this.loader.once('complete', () => {
			if (this.mecha) {
				this.ticker.add(deltaTime => this.mecha.render(deltaTime));
			}
			if (this.robot) {
				this.ticker.add(deltaTime => this.robot.render(deltaTime));
			}
		});

		this.loader.load();
	}

	public changeTexture(boneNameToTexture) {
		// if (this.mecha) {
			this.mecha.changeTexture(boneNameToTexture)
		// }
	}

	private touchHandler(event: PIXI.interaction.InteractionEvent): void {
		const x = Math.min(Math.max(event.data.global.x, this.moveArea.left), this.moveArea.right);
		const y = Math.min(Math.max(event.data.global.y, this.moveArea.top), this.moveArea.bottom);

		if (this.mecha) {
 			this.mecha.goTo(x, y);
		}
		if (this.robot) {
			this.robot.goTo(x, y);
		}
	}
}

