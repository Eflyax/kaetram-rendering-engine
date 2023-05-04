import Mecha from "../dragonBones/src/Mecha";

export class App extends PIXI.Application {

    private moveArea: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 900, 500);

    constructor() {
        super({
            width: 800,
            height: 600,
            backgroundColor: 0x000000,
            autoStart: true,
            sharedTicker: true,
            sharedLoader: true,
        });

			PIXI.loader.add('girl/sprites/head.png');

			PIXI.loader.add('resource/mecha_1004d/mecha_1004d_ske.json');
			PIXI.loader.add('resource/mecha_1004d/mecha_1004d_tex.json');
			PIXI.loader.add('resource/mecha_1004d/mecha_1004d_tex.png');
			// mecha - reexported
			PIXI.loader.add('resource/a/mecha_1004d_ske.json');
			PIXI.loader.add('resource/a/mecha_1004d_tex.json');
			PIXI.loader.add('resource/a/mecha_1004d_tex.png');

			PIXI.loader.once('complete', (
					loader: PIXI.loaders.Loader,
					resources: dragonBones.Map<PIXI.loaders.Resource>,
			) => {
				this.mechaDemo = new Mecha(
					resources['resource/mecha_1004d/mecha_1004d_ske.json'].data,
					resources['resource/mecha_1004d/mecha_1004d_tex.json'].data,
					resources['resource/mecha_1004d/mecha_1004d_tex.png'].texture,
					'DEMO'
				);

        this.mechaDemo.x = 500.0;
        this.mechaDemo.y = 250.0;
        this.stage.addChild(this.mechaDemo);

				this.mecha = new Mecha(
					resources['resource/a/mecha_1004d_ske.json'].data,
					resources['resource/a/mecha_1004d_tex.json'].data,
					resources['resource/a/mecha_1004d_tex.png'].texture,
					'REEXP'
				);

        this.mecha.x = 100.0;
        this.mecha.y = 250.0;
        this.stage.addChild(this.mecha);
			});

        // Enable mouse controls
        this.stage.interactive = true;
        this.stage.hitArea = this.screen;
        this.stage.on('touchstart', this.touchHandler, this);
        this.stage.on('touchmove', this.touchHandler, this);
        this.stage.on('mousedown', this.touchHandler, this);
        // Move personnage by dragging
        let drag: boolean = false;
        this.stage.on('mousedown', () => drag = true, this);
        this.stage.on('mouseup', () => drag = false, this);
        this.stage.on('mousemove', (e: PIXI.interaction.InteractionEvent) => drag && this.touchHandler(e), this);

        // Displays pointer where girl is going to
        // this.targetPoint.x = 150.0;
        // this.targetPoint.y = 150.0;
        // this.stage.addChild(this.targetPoint);

        document.body.appendChild(this.view);

        // Add girl ticker to pixi application when loaded
        this.loader.once('complete', () => {
            this.ticker.add(deltaTime => this.mechaDemo.render(deltaTime));
            // this.ticker.add(deltaTime => this.hand.render(deltaTime));
        });

        // Load all assets
        this.loader.load();
    }

    /**
     * Handle a click on the scene:
     * change Girl target, and make Girl going to target.
     */
    private touchHandler(event: PIXI.interaction.InteractionEvent): void {
        const x = Math.min(Math.max(event.data.global.x, this.moveArea.left), this.moveArea.right);
        const y = Math.min(Math.max(event.data.global.y, this.moveArea.top), this.moveArea.bottom);

        this.mechaDemo.moveTo(x, y);

        // this.targetPoint.x = x;
        // this.targetPoint.y = y;
    }
}

