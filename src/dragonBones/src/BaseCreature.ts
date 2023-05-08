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

	private _skeletonJsonData;
	private _textureJsonData;
	private _texture;
	private _armatureName;

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

	}
};
