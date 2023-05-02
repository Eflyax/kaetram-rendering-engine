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
		this.factory = new dragonBones.PixiFactory();

		PIXI.loader.add('girl/dragonbones-export/Girl_ske.json');
		PIXI.loader.add('girl/dragonbones-export/Girl_tex.json');

		this.draw({
			'body.png': 'girl/sprites/body.png',
			'eyes-closed.png': 'girl/sprites/eyes-closed.png',
			'eyes-open.png': 'girl/sprites/eyes-open.png',
			'head.png': 'girl/sprites/head.png',
			'leg-left.png': 'girl/sprites/leg-left.png',
			'leg-right.png': 'girl/sprites/leg-right.png',
			'scarf.png': 'girl/sprites/scarf.png',
		});
	}

	public changeClothes(newClothes = {} as Record<string, string>) {
		for (const boneName in newClothes) {
			PIXI.loader.add(newClothes[boneName]);
		}
		// https://github.com/DragonBones/DragonBonesJS/blob/master/Egret/Demos/src/ReplaceSlotDisplay.ts
		// Replace mesh's texture with display0002.
		// this._factory.replaceSlotDisplay(
		// 	"ReplaceSlotDisplay",
		// 	"MyDisplay",
		// 	"ball",
		// 	"display0002",
		// 	this._armatureDisplay.armature.getSlot("mesh")
		// );

		// factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
		// armatureName: 'Armature', dragonBonesName: ''

		// console.log({scarf_slot: this.armature.armature.getSlot("scarf.png")});


		PIXI.loader.once('complete', (
			loader: PIXI.loaders.Loader,
			resources: dragonBones.Map<PIXI.loaders.Resource>,
		) => {
			console.log('Changing clothes...');

			// not working (old texture is only removed)
			// const replaced = this.factory.replaceSlotDisplay(
			// 	null,//"",
			// 	"Armature",
			// 	null,//"scarf.png",
			// 	// 'scarf2.png',
			// 	resources['girl/sprites/scarf2.png'],
			// 	this.armature.armature.getSlot("scarf.png")
			// );
			// console.log({replaced});

			// this.armature.armature.getSlot('scarf.png').replaceTextureData(resources['girl/sprites/scarf2.png'], 0)
			// this.factory._textureAtlasDataMap.Girl[0].textures["scarf.png"].renderTexture = resources['girl/sprites/scarf2.png'];


			// console.log(this.armature.armature.getSlot("scarf.png"));
			var slotdisplayslot = this.armature.armature.getSlot("scarf.png")._display._texture;
			// This is my new texture from another DragonBones project
			// var j = (this.factory as any)._getTextureData("upperArmour", "a_bluearmour_bk");

			var copyslot = slotdisplayslot;
			console.log({copyslot});
			copyslot.texture = resources['girl/sprites/scarf2.png'].texture;

			this.factory.replaceSlotDisplay(
				null,
				"Armature",
				null,
				copyslot.name,
				this.armature.armature.getSlot("scarf.png")
			);

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

			if (this.armature) {
				console.log({currenAtmature: this.armature});

				// this.factory.clear(); // still pause animation

				console.log('Removing old data');
				this.removeChild(this.armature);
				this.factory.removeDragonBonesData(resources['girl/dragonbones-export/Girl_ske.json'].data);
				// this.factory.removeTextureAtlasData(atlasData.data.name);
			}

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
