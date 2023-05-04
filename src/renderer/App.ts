// import Star from './Star';
// import Hand from './Hand';
// import Girl from './Girl';

// export class App extends PIXI.Application {
//     private hand: Hand;

//     // Girl is able to move inside this rectangle
//     private moveArea: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 900, 500);

//     // Where Girl is going to
//     private targetPoint: PIXI.Graphics = new Star();

//     constructor() {
//         super({
//             width: 800,
//             height: 600,
//             backgroundColor: 0x000000,
//             autoStart: true,
//             sharedTicker: true,
//             sharedLoader: true,
//         });

//         this.hand = new Hand();
//         this.hand.x = 100.0;
//         this.hand.y = 250.0;
//         this.stage.addChild(this.hand);

// 				this.girl = new Girl();
//         this.girl.x = 500.0;
//         this.girl.y = 250.0;
//         this.stage.addChild(this.girl);

//         // Enable mouse controls
//         this.stage.interactive = true;
//         this.stage.hitArea = this.screen;
//         this.stage.on('touchstart', this.touchHandler, this);
//         this.stage.on('touchmove', this.touchHandler, this);
//         this.stage.on('mousedown', this.touchHandler, this);
//         // Move personnage by dragging
//         let drag: boolean = false;
//         this.stage.on('mousedown', () => drag = true, this);
//         this.stage.on('mouseup', () => drag = false, this);
//         this.stage.on('mousemove', (e: PIXI.interaction.InteractionEvent) => drag && this.touchHandler(e), this);

//         // Displays pointer where girl is going to
//         this.targetPoint.x = 150.0;
//         this.targetPoint.y = 150.0;
//         this.stage.addChild(this.targetPoint);

//         document.body.appendChild(this.view);

//         // Add girl ticker to pixi application when loaded
//         this.loader.once('complete', () => {
//             this.ticker.add(deltaTime => this.girl.render(deltaTime));
//             this.ticker.add(deltaTime => this.hand.render(deltaTime));
//         });

//         // Load all assets
//         this.loader.load();
//     }

//     /**
//      * Handle a click on the scene:
//      * change Girl target, and make Girl going to target.
//      */
//     private touchHandler(event: PIXI.interaction.InteractionEvent): void {
//         const x = Math.min(Math.max(event.data.global.x, this.moveArea.left), this.moveArea.right);
//         const y = Math.min(Math.max(event.data.global.y, this.moveArea.top), this.moveArea.bottom);

//         this.girl.moveTo(x, y);

//         this.targetPoint.x = x;
//         this.targetPoint.y = y;
//     }
// }

