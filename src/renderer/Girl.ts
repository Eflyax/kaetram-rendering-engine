// import * as dragonBones from './dragonBones.min.js';

// console.log(dragonBones);

export default class Girl extends PIXI.Container {
	private armature: dragonBones.PixiArmatureDisplay;

	private blinkingThread: number;

	private walking: boolean = false;
	private WALK_SPEED: number = 5;

	private targetX: number;
	private targetY: number;

	private factory;

	constructor() {
		super();

		// TODO - move PIXI.loader to some kind of manager
		PIXI.loader.add('girl/dragonbones-export/Girl_ske.json');
		PIXI.loader.add('girl/dragonbones-export/Girl_tex.json');
		PIXI.loader.add('girl/dragonbones-export/Girl_tex.png');


		PIXI.loader.once('complete', (
			loader: PIXI.loaders.Loader,
			resources: dragonBones.Map<PIXI.loaders.Resource>,
		) => {
			// Parse and create Girl Armature
			this.factory = new dragonBones.PixiFactory();

			/**
			 * Skeleton
			 * TODO - set parameter for "parseDragonBonesData" through constructor
			 */
			this.factory.parseDragonBonesData(resources['girl/dragonbones-export/Girl_ske.json'].data);

			const atlasData = resources['girl/dragonbones-export/Girl_tex.json'].data;
			/**
			 * @param data = "texture" coordinates
			 * @param texture = whole image
			 */
			this.factory.parseTextureAtlasData(
				atlasData,
				resources['girl/dragonbones-export/Girl_tex.png'].texture,
			);


			// textureAtlasData.textures['body.png'].region = { x: 339, y: 280, width: 442, height: 337 };

			this.armature = this.factory.buildArmatureDisplay('Armature');

			// Resize girl
			this.armature.scale.x = 0.1;
			this.armature.scale.y = 0.1;

			// Play idle at the beginning
			this.armature.animation.play('idle');

			// Play animation 5x faster
			this.armature.animation.timeScale = 5;

			// Make eyes blinking (see openEyes and closeEyes)
			this.startBlinking();

			// Add armature sprite to the scene
			this.addChild(this.armature);

			// console.log(this.armature._armature);
		});
	}

	public getArmature(): dragonBones.PixiArmatureDisplay {
		return this.armature;
	}

	/**
	 * Make eyes blinking asynchronously.
	 */
	public startBlinking(): void {
		if (this.blinkingThread) {
			return;
		}

		this.blinkingThread = window.setTimeout(() => {
			this.closeEyes();
			setTimeout(() => {
				this.stopBlinking();
				this.startBlinking();
			}, 100);
		}, Math.random() * 3000);
	}


	public changeScarf() {
		const textAtlasData = this.factory.getTextureAtlasData('Girl');

		console.log({textAtlasData})
	}

	public stopBlinking(): void {
		if (!this.blinkingThread) {
			return;
		}

		this.openEyes();
		this.blinkingThread = undefined;
	}

	public openEyes(): void {
		this.armature.armature.getSlot('eyes').displayIndex = 0;
	}

	public closeEyes(): void {
		this.armature.armature.getSlot('eyes').displayIndex = 1;
	}

	/**
	 * Update target point,
	 * and make Girl walk.
	 * Girl position is real time updated in render().
	 */
	public moveTo(x: number, y: number): void {
		this.targetX = x;
		this.targetY = y;

		if (!this.walking) {
			this.armature.animation.play('walk');
			this.walking = true;
		}
	}

	/**
	 * As scene time is going,
	 * make girl constantly follow target point.
	 * Also switch between "play" and "idle" animations.
	 */
	public render(deltaTime: number): void {
		if (!this.walking) {
			return;
		}

		if (Math.abs(this.x - this.targetX) > this.WALK_SPEED) {
			const direction = this.x < this.targetX ? 1 : -1;

			this.x += deltaTime * this.WALK_SPEED * direction;
		} else if (Math.abs(this.y - this.targetY) > this.WALK_SPEED) {
			const direction = this.y < this.targetY ? 1 : -1;

			this.y += deltaTime * this.WALK_SPEED * direction;
		} else {
			this.x = this.targetX;
			this.y = this.targetY;
			this.armature.animation.play('idle');
			this.walking = false;
		}
	}
}
