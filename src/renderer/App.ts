import Star from './Star';
import Girl from './Girl';

export class App extends PIXI.Application {
	private girl: Girl;
	private moveArea: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 900, 500);
	private targetPoint: PIXI.Graphics = new Star();

	constructor() {
		super({
			width: 800,
			height: 600,
			backgroundColor: 0x000000,
			autoStart: true,
			sharedTicker: true,
			sharedLoader: true,
		});


		PIXI.loader.add('girl/dragonbones-export/Girl_ske.json');
		PIXI.loader.add('girl/dragonbones-export/Girl_tex.json');


		const boneTextures = {
			'body.png': 'girl/sprites/body.png',
			'eyes-closed.png': 'girl/sprites/eyes-closed.png',
			'eyes-open.png': 'girl/sprites/eyes-open.png',
			'head.png': 'girl/sprites/head.png',
			'leg-left.png': 'girl/sprites/leg-left.png',
			'leg-right.png': 'girl/sprites/leg-right.png',
			'scarf.png': 'girl/sprites/scarf.png',
		};

		for (const boneName in boneTextures) {
			PIXI.loader.add(boneTextures[boneName]);
		}

		PIXI.loader.once('complete', (loader, resources) => {
			console.log('complete');
			const
				skeletonData = resources['girl/dragonbones-export/Girl_ske.json'].data,
				texturesData = resources['girl/dragonbones-export/Girl_tex.json'].data;

				this.girl = new Girl(skeletonData, texturesData, boneTextures);
				this.girl.x = 100.0;
				this.girl.y = 250.0;
				this.stage.addChild(this.girl);

				console.log(this.girl);

				this.girl2 = new Girl(skeletonData, texturesData, boneTextures);
				this.girl2.x = 200.0;
				this.girl2.y = 250.0;
				this.stage.addChild(this.girl2);
		});


		// Enable mouse controls
		this.stage.interactive = true;
		this.stage.hitArea = this.screen;
		this.stage.on('touchstart', this.touchHandler, this);
		this.stage.on('touchmove', this.touchHandler, this);
		this.stage.on('mousedown', this.touchHandler, this);
		// Move personnage by dragging
		let drag: boolean = false;
		this.stage.on('mousedown', () => drag = true, this);
		this.stage.on('mouseup', () => drag = false, this);
		this.stage.on('mousemove', (e: PIXI.interaction.InteractionEvent) => drag && this.touchHandler(e), this);

		// Displays pointer where girl is going to
		this.targetPoint.x = 150.0;
		this.targetPoint.y = 150.0;
		this.stage.addChild(this.targetPoint);

		document.body.appendChild(this.view);

		// Add girl ticker to pixi application when loaded
		this.loader.once('complete', () => {
			this.ticker.add(deltaTime => this.girl.render(deltaTime));
		});

		// Load all assets
		this.loader.load();
	}

	/**
	 * Handle a click on the scene:
	 * change Girl target, and make Girl going to target.
	 */
	private touchHandler(event: PIXI.interaction.InteractionEvent): void {
		const x = Math.min(Math.max(event.data.global.x, this.moveArea.left), this.moveArea.right);
		const y = Math.min(Math.max(event.data.global.y, this.moveArea.top), this.moveArea.bottom);

		this.girl.moveTo(x, y);

		this.targetPoint.x = x;
		this.targetPoint.y = y;
	}
}

