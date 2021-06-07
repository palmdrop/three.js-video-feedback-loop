import * as THREE from 'three'

export class CameraRig {
    constructor(camera) {
        this.camera = camera;

        // For mouse drag movement
        this.anchor = {
            anchored: false,
            previous: null,
            current: null,
            sensitivity: 0.05
        };

        if(!camera) throw new Error("Camera cannot be null");
    }

    setAnchor(anchored, startPosition) {
        if(!anchored) startPosition = null;
        this.anchor.anchored = anchored;
        this.anchor.current  = startPosition;
        this.anchor.previous = startPosition;
    }

    anchorRotate(currentPosition) {
        if(!this.anchor.anchored) return;
        this.anchor.previous = this.anchor.current;
        this.anchor.current = currentPosition;

        this.offset = this.anchor.current.clone().sub(this.anchor.previous);
        this.offset.multiplyScalar(this.anchor.sensitivity);

        this.camera.addRotation(this.offset, true);
    }


    getCamera() {
        return this.camera;
    }

}