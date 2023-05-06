export default class Mecha extends PIXI.Container {

	private armature: dragonBones.PixiArmatureDisplay;
	private blinkingThread: number;
	private walking: boolean = false;
	private WALK_SPEED: number = 5;
	private targetX: number;
	private targetY: number;

	constructor(
		skeletonJsonData,
		textureJsonData,
		texture,
		name
	) {
			super();
			this.name = name;
			const factory = new dragonBones.PixiFactory();

			factory.parseDragonBonesData(skeletonJsonData);

			factory.parseTextureAtlasData(
					textureJsonData,
					texture,
			);

			this.armature = factory.buildArmatureDisplay('mecha_1004d');

			this.armature.scale.x = 1;
			this.armature.scale.y = 1;
			this.armature.animation.play('idle');
			this.armature.animation.timeScale = 2;
			this.startBlinking();
			this.addChild(this.armature);

			const slot = this.armature.armature.getSlot('pelvis')

			slot._renderDisplay._texture.baseTexture = PIXI.loader.resources['girl/sprites/head.png'].texture.baseTexture;
	}

	public getArmature(): dragonBones.PixiArmatureDisplay {
		return this.armature;
	}

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
		// this.armature.armature.getSlot('eyes').displayIndex = 0;
	}

	public closeEyes(): void {
			// this.armature.armature.getSlot('eyes').displayIndex = 1;
	}

	public moveTo(x: number, y: number): void {
			this.targetX = x;
			this.targetY = y;

			if (!this.walking) {
					this.armature.animation.play('walk');
					this.walking = true;
			}
	}

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
