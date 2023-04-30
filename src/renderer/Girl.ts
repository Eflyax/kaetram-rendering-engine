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
		//
		PIXI.loader.add('girl/sprites/body.png');
		PIXI.loader.add('girl/sprites/eyes-closed.png');
		PIXI.loader.add('girl/sprites/eyes-open.png');
		PIXI.loader.add('girl/sprites/head.png');
		PIXI.loader.add('girl/sprites/leg-left.png');
		PIXI.loader.add('girl/sprites/leg-right.png');
		PIXI.loader.add('girl/sprites/scarf.png');

		PIXI.loader.once('complete', (
			loader: PIXI.loaders.Loader,
			resources: dragonBones.Map<PIXI.loaders.Resource>,
		) => {
			this.factory = new dragonBones.PixiFactory();

			this.factory.parseDragonBonesData(resources['girl/dragonbones-export/Girl_ske.json'].data);

			const atlasData = resources['girl/dragonbones-export/Girl_tex.json'].data;

			this.factory.parseTextureAtlasData(
				atlasData,
				{},
				null,
				null,
				{
						'body.png':  resources['girl/sprites/body.png'].texture,
						'eyes-closed.png':  resources['girl/sprites/eyes-closed.png'].texture,
						'eyes-open.png':  resources['girl/sprites/eyes-open.png'].texture,
						'head.png':  resources['girl/sprites/head.png'].texture,
						'leg-left.png':  resources['girl/sprites/leg-left.png'].texture,
						'leg-right.png':  resources['girl/sprites/leg-right.png'].texture,
						'scarf.png':  resources['girl/sprites/scarf.png'].texture,
				}
			);

			this.armature = this.factory.buildArmatureDisplay('Armature');

			// Resize girl
			this.armature.scale.x = 0.1;
			this.armature.scale.y = 0.1;

			// Play idle at the beginning
			this.armature.animation.play('idle');

			// Play animation 5x faster
			this.armature.animation.timeScale = 3;

			// Make eyes blinking (see openEyes and closeEyes)
			this.startBlinking();

			// Add armature sprite to the scene
			this.addChild(this.armature);

			// console.log(this.armature._armature);
		});
	}

	public changeScarf() {
		console.log('changeScarf');
		PIXI.loader.add('girl/dragonbones-export/Girl_tex2.png');
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
