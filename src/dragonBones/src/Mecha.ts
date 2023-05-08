import BaseCreature from './BaseCreature';

export default class Mecha extends BaseCreature {

	private armature: dragonBones.PixiArmatureDisplay;
	private blinkingThread: number;
	private durationChangingClothes = 1000;

	constructor(
		skeletonJsonData,
		textureJsonData,
		texture,
		armatureName
	) {
		super(
			skeletonJsonData,
			textureJsonData,
			texture,
			armatureName
		);
		this._armatureDisplay.scale.x = 1;
		this._armatureDisplay.scale.y = 1;
		this._armatureDisplay.animation.play('idle');
		this._armatureDisplay.animation.timeScale = 2;
		this.startBlinking();
		this.addChild(this._armatureDisplay);
	}

	public changeTexture(texturesToChange: Record<string, string>): void {
		this.walking = false;
		this.targetX = this.x;
		this.targetY = this.y;
		this.armature.animation.timeScale = 0.1;
		this.armature.animation.play('victory');

		let
			readyToSwapTexture = true,
			texturesToProcess = Object.values(texturesToChange);

		for (const slotName in texturesToChange) {
			const textureName = texturesToChange[slotName];

			if (!PIXI.loader.resources[textureName]) {
				PIXI.loader.add(textureName);
				readyToSwapTexture = false;
			}
			else {
				texturesToProcess = texturesToProcess.filter(texture => texture !== textureName);
			}
	}

	if (!readyToSwapTexture) {
		PIXI.loader.onLoad.add((loader, loadedTexture) => {
			texturesToProcess = texturesToProcess.filter(texture => texture !== loadedTexture.name);

			if (!texturesToProcess.length) {
				readyToSwapTexture = true;
			}
		});
	}

	let swappingTextureTimeout = setTimeout(() => {
		if (readyToSwapTexture) {
			this._swapLoadedTextures(texturesToChange);
			this.armature.animation.timeScale = 2;
			this.armature.animation.fadeIn('idle', 1);
			this.movable = true;
		}
		else {
			// todo - some unknown error
		}
		clearTimeout(swappingTextureTimeout);
	}, this.durationChangingClothes);
	}

	private _swapLoadedTextures(texturesToChange: Record<string, string>): void {
		for (const slotName in texturesToChange) {
			const
			slot = this.armature.armature.getSlot(slotName),
			baseTexture = PIXI.loader.resources[texturesToChange[slotName]].texture.baseTexture;

			slot._renderDisplay._texture.baseTexture = baseTexture;
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
	// this.armature.armature.getSlot('eyes').displayIndex = 0;
	}

	public closeEyes(): void {
		// this.armature.armature.getSlot('eyes').displayIndex = 1;
	}

	public render(deltaTime: number): void {
		super.render(deltaTime);
		if (!this.walking) {
			return;
		}

		// if (Math.abs(this.x - this.targetX) > this.WALK_SPEED) {
		// 	const direction = this.x < this.targetX ? 1 : -1;

		// 	this.x += deltaTime * this.WALK_SPEED * direction;
		// }
		// else if (Math.abs(this.y - this.targetY) > this.WALK_SPEED) {
		// 	const direction = this.y < this.targetY ? 1 : -1;

		// 	this.y += deltaTime * this.WALK_SPEED * direction;
		// }
		// else {
		// 	this.x = this.targetX;
		// 	this.y = this.targetY;
		// 	this._armatureDisplay.animation.play('idle');
		// 	this.walking = false;
		// }
	}
}
