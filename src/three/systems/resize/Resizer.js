import * as THREE from 'three'

class Resizer {
    constructor(container, camera, renderer, useDevicePixelRatio = false) {
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;
        this.useDevicePixelRatio = useDevicePixelRatio;
        
        this.resize();
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Fetch the current size
        const currentSize = this.renderer.getSize(new THREE.Vector2());

        // And calculate the new size
        const newSize = new THREE.Vector2(width, height);
        // ... possibly using the device pixel ratio
        if(this.useDevicePixelRatio) newSize.multiplyScalar(window.devicePixelRatio);

        // Check if the size has actually been updated
        if(currentSize.equals(newSize)) return;
        
        // Update canvas size
        this.renderer.setSize( newSize.x, newSize.y, false );

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
};

export { Resizer };