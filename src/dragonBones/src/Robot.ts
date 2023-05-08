import BaseCreature from './BaseCreature';

export default class Robot extends BaseCreature {

	private static readonly MAX_MOVE_SPEED_FRONT: number = Robot.NORMALIZE_MOVE_SPEED * 1.4;
	private static readonly MAX_MOVE_SPEED_BACK: number = Robot.NORMALIZE_MOVE_SPEED * 1.0;

	private static readonly NORMAL_ANIMATION_GROUP: string = "normal";
	private static readonly AIM_ANIMATION_GROUP: string = "aim";
	private static readonly ATTACK_ANIMATION_GROUP: string = "attack";

	private _isAttackingA: boolean = false;
	private _isAttackingB: boolean = false;
	private _aimState: dragonBones.AnimationState | null = null;
	private _walkState: dragonBones.AnimationState | null = null;
	private _attackState: dragonBones.AnimationState | null = null;;

	public constructor(
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

		// this._armatureDisplay = this.factory.buildArmatureDisplay('mecha_1502b');

		this._armatureDisplay.x = 0.0;
		this._armatureDisplay.y = 300;
		this._armature = this._armatureDisplay.armature;
		this._armatureDisplay.on(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
		this._armatureDisplay.on(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
		this._armatureDisplay.on(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);

		this._weaponL = this._armature.getSlot("weapon_l").childArmature;
		this._weaponR = this._armature.getSlot("weapon_r").childArmature;

		this.addChild(this._armatureDisplay);
		this._updateAnimation();
	}

	public mouseMove(event: PIXI.interaction.InteractionEvent): void {
		this.aim(event.data.global.x - this.x, event.data.global.y - this.y);

		if (event.type === 'touchstart' || event.type === 'mousedown') {
			this.attack(true);
		}
		else if (event.type === 'touchend' || event.type === 'mouseup') {
			this.attack(false);
		}
	}

	public move(dir: number): void {
		if (this._moveDir === dir) {
			return;
		}

		this._moveDir = dir;
		this._updateAnimation();
	}

	public jump(): void {
		if (this._isJumpingA) {
			return;
		}

		this._isJumpingA = true;
		this._armature.animation.fadeIn(
			"jump_1", -1.0, -1,
			0, Robot.NORMAL_ANIMATION_GROUP
		).resetToPose = false;

		this._walkState = null;
	}

	public attack(isAttacking: boolean): void {
		if (this._isAttackingA === isAttacking) {
			return;
		}

		this._isAttackingA = isAttacking;
	}

	public aim(x: number, y: number): void {
		this._target.x = x;
		this._target.y = y;
	}

	public render(): void {
		this._updatePosition();
		this._updateAim();
		this._updateAttack();
	}

	private _animationEventHandler(event: EventType): void {
		switch (event.type) {
			case dragonBones.EventObject.FADE_IN_COMPLETE:
				if (event.animationState.name === "jump_1") {
					this._speedY = -Robot.JUMP_SPEED;

					if (this._moveDir !== 0) {
						if (this._moveDir * this._faceDir > 0) {
							this._speedX = Robot.MAX_MOVE_SPEED_FRONT * this._faceDir;
						}
						else {
							this._speedX = -Robot.MAX_MOVE_SPEED_BACK * this._faceDir;
						}
					}

					this._armature.animation.fadeIn(
						"jump_2", -1.0, -1,
						0, Robot.NORMAL_ANIMATION_GROUP
					).resetToPose = false;
				}
				break;

			case dragonBones.EventObject.FADE_OUT_COMPLETE:
				if (event.animationState.name === "attack_01") {
					this._isAttackingB = false;
					this._attackState = null;
				}
				break;

			case dragonBones.EventObject.COMPLETE:
				if (event.animationState.name === "jump_4") {
					this._isJumpingA = false;
					this._updateAnimation();
				}
				break;
		}
	}

	private _updateAnimation(): void {
		if (this._isJumpingA) {
			return;
		}

		if (this._moveDir === 0) {
			this._speedX = 0;
			this._armature.animation.fadeIn(
				"idle", -1.0, -1, 0,
				Robot.NORMAL_ANIMATION_GROUP
			).resetToPose = false;

			this._walkState = null;
		}
		else {
			if (this._walkState === null) {
				this._walkState = this._armature.animation.fadeIn(
					"walk", -1.0, -1,
					0, Robot.NORMAL_ANIMATION_GROUP
				);

				this._walkState.resetToPose = false;
			}

			if (this._moveDir * this._faceDir > 0) {
				this._walkState.timeScale = Robot.MAX_MOVE_SPEED_FRONT / Robot.NORMALIZE_MOVE_SPEED;
			}
			else {
				this._walkState.timeScale = -Robot.MAX_MOVE_SPEED_BACK / Robot.NORMALIZE_MOVE_SPEED;
			}

			if (this._moveDir * this._faceDir > 0) {
				this._speedX = Robot.MAX_MOVE_SPEED_FRONT * this._faceDir;
			}
			else {
				this._speedX = -Robot.MAX_MOVE_SPEED_BACK * this._faceDir;
			}
		}
	}

	private _updatePosition(): void {
		if (this._speedX !== 0.0) {
			this._armatureDisplay.x += this._speedX;
			if (this._armatureDisplay.x < -Game.instance.stageWidth * 0.5) {
				this._armatureDisplay.x = -Game.instance.stageWidth * 0.5;
			}
			else if (this._armatureDisplay.x > Game.instance.stageWidth * 0.5) {
				this._armatureDisplay.x = Game.instance.stageWidth * 0.5;
			}
		}

		if (this._speedY !== 0.0) {
			if (this._speedY < 5.0 && this._speedY + Game.G >= 5.0) {
				this._armature.animation.fadeIn(
					"jump_3", -1.0, -1, 0
					, Robot.NORMAL_ANIMATION_GROUP
				).resetToPose = false;
			}

			this._speedY += Game.G;
			this._armatureDisplay.y += this._speedY;

			if (this._armatureDisplay.y > Game.GROUND) {
				this._armatureDisplay.y = Game.GROUND;
				this._speedY = 0.0;
				this._armature.animation.fadeIn(
					"jump_4", -1.0, -1,
					0, Robot.NORMAL_ANIMATION_GROUP
				).resetToPose = false;
			}
		}
	}

	private _updateAim(): void {
		this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
		if (this._armatureDisplay.armature.flipX !== this._faceDir < 0) {
			this._armatureDisplay.armature.flipX = !this._armatureDisplay.armature.flipX;

			if (this._moveDir !== 0) {
				this._updateAnimation();
			}
		}

		const aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scale.y;
		if (this._faceDir > 0) {
			this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
		}
		else {
			this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
			if (this._aimRadian > Math.PI) {
				this._aimRadian -= Math.PI * 2.0;
			}
		}

		let aimDir = 0;
		if (this._aimRadian > 0.0) {
			aimDir = -1;
		}
		else {
			aimDir = 1;
		}

		if (this._aimState === null || this._aimDir !== aimDir) {
			this._aimDir = aimDir;

			if (this._aimDir >= 0) {
				this._aimState = this._armature.animation.fadeIn(
					"aim_up", -1.0, -1,
					0, Robot.AIM_ANIMATION_GROUP
				);
			}
			else {
				this._aimState = this._armature.animation.fadeIn(
					"aim_down", -1.0, -1,
					0, Robot.AIM_ANIMATION_GROUP
				);
			}

			this._aimState.resetToPose = false;
		}

		this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);
		this._armature.invalidUpdate();
	}

	private _updateAttack(): void {
		if (!this._isAttackingA || this._isAttackingB) {
			return;
		}

		this._isAttackingB = true;
		this._attackState = this._armature.animation.fadeIn(
			"attack_01", -1.0, -1,
			0, Robot.ATTACK_ANIMATION_GROUP
		);

		this._attackState.resetToPose = false;
		this._attackState.autoFadeOutTime = 0.1;
	}
}
