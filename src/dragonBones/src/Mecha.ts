export default class Mecha extends PIXI.Container {

	private armature: dragonBones.PixiArmatureDisplay;
	private blinkingThread: number;
	private walking: boolean = false;
	private WALK_SPEED: number = 5;
	private targetX: number;
	private targetY: number;
	private durationChangingClothes = 1000;

	constructor(
		skeletonJsonData,
		textureJsonData,
		texture,
		name,
		armatureName
	) {
			super();
			this.name = name;
			const factory = new dragonBones.PixiFactory();

			factory.parseDragonBonesData(skeletonJsonData);

			factory.parseTextureAtlasData(
					textureJsonData,
					texture,
			);

			this.armature = factory.buildArmatureDisplay(armatureName);

			this.armature.scale.x = 1;
			this.armature.scale.y = 1;
			this.armature.animation.play('idle');
			this.armature.animation.timeScale = 0.2;
			this.startBlinking();
			this.addChild(this.armature);
	}

	public changeTexture(texturesToChange: Record<string, string>): void {
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

		this.armature.animation.timeScale = 0.2;
		this.armature.animation.play('victory');
		let swappingTextureTimeout = setTimeout(() => {
			if (readyToSwapTexture) {
				this._swapLoadedTextures(texturesToChange);
				this.armature.animation.timeScale = 2;
				this.armature.animation.fadeIn('idle', 1);
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
