import * as THREE from 'three'

import { createRenderer } from '../systems/render/renderer'
import { createScene } from '../components/scene/scene'
import { createCamera } from '../components/camera/camera'
import { createTorusKnot } from '../components/models/torusKnot';
import { createRoom } from '../components/models/room';
import { createLights } from '../components/light/createLights';
import { createScreen } from '../components/models/screen';
import { loadDuck } from '../components/models/duck';
import { Resizer } from '../systems/resize/Resizer';

//import { ASSETHANDLER } from '../systems/assets/AssetHandler'

let GLOBALS = {
    far: 50,
    near: 0.1,
    backgroundColor: 0x455443,

    useSRGB: false,
};

class World {
    constructor(canvas) {
        //this.assetHandler = assetHandler;

        // Array of objects that require update each frame
        this.updateables = [];

        // RENDERER
        this.renderer = createRenderer(canvas);
        this.canvas = this.renderer.domElement; // Canvas will be created if none is supplied

        // CAMERA
        const {camera, rig} = createCamera(this.canvas.width, this.canvas.height);
        this.camera = camera;
        this.cameraRig = rig;

        // SCENE
        this.scene = createScene(GLOBALS.backgroundColor);

        // MODELS
        this.torusKnot = createTorusKnot();
        this.torusKnot.update = function(delta, time) {
            this.rotation.x += 0.1 * delta;
            this.rotation.y += 0.2 * delta;
        };

        this.room = createRoom();

        const {renderToScreen, screen} = createScreen(this.renderer, this.scene, this.camera);
        this.screen = screen;
        //this.target1 = target1;
        //this.target2 = target2;
        this.renderToScreen = renderToScreen;
        this.screen.position.set(0, 0.5, -4.9);

        // LIGHTS
        this.lights = createLights();

        // Add all objects to scene
        this.scene.add( 
            this.room,
            //this.torusKnot,
            this.screen,
            ...this.lights
        );

        // RESIZE
        this.resizer = new Resizer(this.canvas, this.camera, this.renderer, true);

        // Add objects to updateables array
        this.scene.traverse(object => {
            if(typeof object.update === "function") {
                this.updateables.push(object);
            }
        });
        this.updateables.push(camera);
    }

    async initialize() {
        this.duck = await loadDuck();
        this.scene.add(this.duck);

    }

    resize() {
        this.resizer.resize();
    }

    update(delta, time) {
        //this.camera.update(delta, time);
        this.updateables.forEach((object) => {
            object.update(delta, time);
        });
    }

    render(delta) {
        /*if(this.screen.first) {
            this.renderer.setRenderTarget(this.target2);
        } else {
            this.renderer.setRenderTarget(this.target1);
        }
        this.renderer.render( this.scene, this.camera );
        */
        this.renderToScreen(delta);

        // Render the scene
        this.renderer.setRenderTarget(null);
        this.renderer.render( this.scene, this.camera );
    }
}


export {
    World,
    GLOBALS
}