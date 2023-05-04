
export default class Character extends PIXI.Container {
	private armature: dragonBones.PixiArmatureDisplay;

	private blinkingThread: number;

	private walking: boolean = false;
	private WALK_SPEED: number = 5;

	private targetX: number;
	private targetY: number;

	constructor() {
			super();

			// Import girl texture and armature data exported from Blender COA tools
			// 		"resource/mecha_1004d/mecha_1004d_ske.json",
			// 		"resource/mecha_1004d/mecha_1004d_tex.json",
			// 		"resource/mecha_1004d/mecha_1004d_tex.png"
			PIXI.loader.add('resource/mecha_1004d/mecha_1004d_ske.json');
			PIXI.loader.add('resource/mecha_1004d/mecha_1004d_tex.json');
			PIXI.loader.add('resource/mecha_1004d/mecha_1004d_tex.png');

			PIXI.loader.once('complete', (
					loader: PIXI.loaders.Loader,
					resources: dragonBones.Map<PIXI.loaders.Resource>,
			) => {
					// Parse and create Girl Armature
					const factory = new dragonBones.PixiFactory();

					factory.parseDragonBonesData(resources['resource/mecha_1004d/mecha_1004d_ske.json'].data);

					factory.parseTextureAtlasData(
							resources['resource/mecha_1004d/mecha_1004d_tex.json'].data,
							resources['resource/mecha_1004d/mecha_1004d_tex.png'].texture,
					);

					this.armature = factory.buildArmatureDisplay('mecha_1004d');

					// Resize girl
					this.armature.scale.x = 1;
					this.armature.scale.y = 1;

					// Play idle at the beginning
					this.armature.animation.play('idle');

					// Play animation 5x faster
					this.armature.animation.timeScale = 2;

					// Make eyes blinking (see openEyes and closeEyes)
					this.startBlinking();

					const bonesToResources = {};

					console.log(this.armature.armature);
					// console.log({deti: this.armature.children});
					// for(const key in this.armature.children) {
					// 		const childSlot = this.armature.children[key];
					// 		console.log({childSlotTe: childSlot._texture.baseTexture.imageUrl});
					// 		// bonesToResources[key] = childSlot.
					// }
					// Add armature sprite to the scene
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
			// this.armature.armature.getSlot('eyes').displayIndex = 0;
	}

	public closeEyes(): void {
			// this.armature.armature.getSlot('eyes').displayIndex = 1;
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
