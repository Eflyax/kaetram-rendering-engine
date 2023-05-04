import BaseDemo from "./BaseDemo";

const
	PATH_SKE_JSON = 'resource/tryToImport/TryToImport_ske.json',
	PATH_TEX_JSON = 'resource/tryToImport/TryToImport_tex.json',
	PATH_TEX_PNG = 'resource/tryToImport/TryToImportAtlas_tex.png';

export default class AnimationLayer extends BaseDemo {
	private _armatureDisplay: dragonBones.PixiArmatureDisplay;

	public constructor() {
			super();

			// todo load hand resources
			this._resources.push(
					PATH_SKE_JSON,
					PATH_TEX_JSON,
					PATH_TEX_PNG
			);
			// this._resources.push(
			// 		"resource/mecha_1004d/mecha_1004d_ske.json",
			// 		"resource/mecha_1004d/mecha_1004d_tex.json",
			// 		"resource/mecha_1004d/mecha_1004d_tex.png"
			// );
	}

	protected _onStart(): void {
			const factory = dragonBones.PixiFactory.factory;
			factory.parseDragonBonesData(this._pixiResources[PATH_SKE_JSON].data);
			factory.parseTextureAtlasData(
				this._pixiResources[PATH_TEX_JSON].data,
				this._pixiResources[PATH_TEX_PNG].texture
			);

			this._armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");
			// this._armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
			// this._armatureDisplay.animation.play("walk");


			this._armatureDisplay.scale.x = 1;
			this._armatureDisplay.scale.y = 1;
			this._armatureDisplay.x = 0.0;
			this._armatureDisplay.y = 0.0;

			console.log(this._armatureDisplay);
			this.addChild(this._armatureDisplay);
	}

	private _animationEventHandler(event: dragonBones.EventObject): void {
			// let attackState = this._armatureDisplay.animation.getState("attack_01");
			// if (!attackState) {
			// 		attackState = this._armatureDisplay.animation.fadeIn("attack_01", 0.1, 1, 1);
			// 		attackState.resetToPose = false;
			// 		attackState.autoFadeOutTime = 0.1;
			// 		attackState.addBoneMask("chest");
			// 		attackState.addBoneMask("effect_l");
			// 		attackState.addBoneMask("effect_r");
			// }
	}
}
