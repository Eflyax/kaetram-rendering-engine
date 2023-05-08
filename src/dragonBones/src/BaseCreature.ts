export default abstract class BaseCreature extends PIXI.Container {
	private static readonly JUMP_SPEED: number = 20;
	private static readonly NORMALIZE_MOVE_SPEED: number = 3.6;
	private _faceDir: number = 1;
	private _aimDir: number = 0;
	private _moveDir: number = 0;
	private _aimRadian: number = 0.0;
	private _speedX: number = 0.0;
	private _speedY: number = 0.0;
	private _armature: dragonBones.Armature;
	private _armatureDisplay: ArmatureDisplayType;
	private _isJumpingA: boolean = false;
	private readonly _target: PointType = new PIXI.Point()
	private factory;

	WALK_SPEED = 2;

	public constructor(
		skeletonJsonData,
		textureJsonData,
		texture,
		armatureName
	) {
		super();
		this.factory = new dragonBones.PixiFactory();

		this.factory.parseDragonBonesData(skeletonJsonData);

		this.factory.parseTextureAtlasData(
			textureJsonData,
			texture
		);
		this._armatureDisplay = this.factory.buildArmatureDisplay(armatureName);
		this._skeletonJsonData = skeletonJsonData;
		this._textureJsonData = textureJsonData;
		this._texture = texture;
		this._armatureName = armatureName;
		this._movable = true;
	}

	public moveTo(x: number, y: number): void {
		this.targetX = x;
		this.targetY = y;

		if (!this.walking) {
			this._armatureDisplay.animation.play('walk');
			this.walking = true;
		}
	}

	public goTo(x: number, y: number): void {
		if (this._movable) {
			this.moveTo(x,y);
		}
	}


	protected render(deltaTime: number): void {
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
			this._armatureDisplay.animation.play('idle');
			this.walking = false;
		}
	}
};
