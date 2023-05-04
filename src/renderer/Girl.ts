export default class Girl extends PIXI.Container {
	private armature: dragonBones.PixiArmatureDisplay;

	private blinkingThread: number;
	private iddleAnimationTimeout: number;

	private walking: boolean = false;
	private WALK_SPEED: number = 5;

	private targetX: number;
	private targetY: number;

	private factory;

	constructor(skeletonData, texturesData, boneTextures) {
		super();
		this.factory = new dragonBones.PixiFactory();

		const
			atlasData = texturesData,
			atlasTextures = {} as Record<string, string>;

		this.factory.parseDragonBonesData(skeletonData);

		for (const boneName in boneTextures) {
			atlasTextures[boneName] = PIXI.loader.resources[boneTextures[boneName]].texture
		}

		this.factory.parseTextureAtlasData(atlasData, {}, null, null, atlasTextures);
		this.armature = this.factory.buildArmatureDisplay('Armature');
		this.armature.scale.x = 0.1;
		this.armature.scale.y = 0.1;

		this.iddleAnimationTimeout = setTimeout(() => {
			this.armature.animation.play('idle');
			clearTimeout(this.iddleAnimationTimeout);
		}, Math.floor(Math.random() * 30) * 10);

		this.armature.animation.timeScale = 3;
		this.startBlinking();
		this.addChild(this.armature);
	}

	public changeClothes(newClothes = {} as Record<string, string>): void {
		let waitForResourcesLoader = false;

		for (const boneName in newClothes) {
			if (!PIXI.loader.resources[newClothes[boneName]]) {
				PIXI.loader.add(newClothes[boneName]);
				waitForResourcesLoader = true;
			}
		}

		if (waitForResourcesLoader) {
			PIXI.loader.once('complete', () => this.setTextures(newClothes));
		}
		else {
			this.setTextures(newClothes);
		}
	}

	private setTextures(newClothes = {}): void {
		for (const boneName in newClothes) {
			const slot = this.armature.armature.getSlot(boneName);

			slot._renderDisplay._texture.baseTexture = PIXI.loader.resources[newClothes[boneName]].texture.baseTexture;
		}
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
		this.armature.armature.getSlot('eyes').displayIndex = 0;
	}

	public closeEyes(): void {
		this.armature.armature.getSlot('eyes').displayIndex = 1;
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
		}
		else if (Math.abs(this.y - this.targetY) > this.WALK_SPEED) {
			const direction = this.y < this.targetY ? 1 : -1;

			this.y += deltaTime * this.WALK_SPEED * direction;
		}
		else {
			this.x = this.targetX;
			this.y = this.targetY;
			this.armature.animation.play('idle');
			this.walking = false;
		}
	}
}
