export default class Hand extends PIXI.Container {
	private armature: dragonBones.PixiArmatureDisplay;
	private blinkingThread: number;
	private walking: boolean = false;
	private WALK_SPEED: number = 5;
	private targetX: number;
	private targetY: number;
	private factory;
	private atlasData;
	private atlasTextures;

	constructor() {
		super();
		this.factory = new dragonBones.PixiFactory();

		// PIXI.loader.add('tryToImport/TryToImport_tex.json');
		// PIXI.loader.add('tryToImport/TryToImport_ske.json');


		PIXI.loader.add('girl/dragonbones-export/Girl_ske.json');
		PIXI.loader.add('girl/dragonbones-export/Girl_tex.json');


		this.draw({
			'body.png': 'tryToImport/TryToImport_texture/MechArm_ARM.png',
			'eyes-closed.png': 'tryToImport/TryToImport_texture/MechArm_FOREARM.png',
			'eyes-open.png': 'tryToImport/TryToImport_texture/MechArm_HAND.png'
		});
	}

	public changeClothes(newClothes = {} as Record<string, string>) {
		for (const boneName in newClothes) {
			console.log({adding: newClothes[boneName]});
			PIXI.loader.add(newClothes[boneName]);
		}

		PIXI.loader.once('complete', (
			loader: PIXI.loaders.Loader,
			resources: dragonBones.Map<PIXI.loaders.Resource>,
		) => {
			console.log('Changing clothes...');

			// todo - find slots by name => replace with resources .texture.baseTexture;
			this.armature.armature._display.children[5]._texture.baseTexture = resources['tryToImport/TryToImport_texture/scarf2.png'].texture.baseTexture;
		});
	}

	public draw(clothes = {} as Record<string, string>, addChild = false) {
		for (const boneName in clothes) {
			PIXI.loader.add(clothes[boneName]);
		}

		PIXI.loader.once('complete', (
			loader: PIXI.loaders.Loader,
			resources: dragonBones.Map<PIXI.loaders.Resource>,
		) => {
			const
				atlasData = resources['girl/dragonbones-export/Girl_tex.json'].data,
				atlasTextures = {} as Record<string, string>;

			this.atlasData = atlasData;

			// if (this.armature) {
			// 	// this.factory.clear(); // still pause animation
			// 	this.removeChild(this.armature);
			// 	// this.factory.removeDragonBonesData(resources['girl/dragonbones-export/Girl_ske.json'].data);
			// 	// this.factory.removeTextureAtlasData(atlasData.data.name);
			// }

			this.factory.parseDragonBonesData(resources['girl/dragonbones-export/Girl_ske.json'].data);

			for (const boneName in clothes) {
				atlasTextures[boneName] = resources[clothes[boneName]].texture
			}

			this.factory.parseTextureAtlasData(
				atlasData,
				{},
				null,
				null,
				atlasTextures
			);

			this.atlasTextures = atlasTextures;

			this.armature = this.factory.buildArmatureDisplay('Armature');
			this.armature.scale.x = 0.1;
			this.armature.scale.y = 0.1;
			this.armature.animation.play('idle');
			this.armature.animation.timeScale = 3;
			this.startBlinking();
			this.addChild(this.armature);
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
