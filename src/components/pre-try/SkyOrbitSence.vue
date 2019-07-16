<template>
  <div>
    
  </div>
</template>

<script>
import * as THREE from 'three';
import ComboControls from 'threejs-camera-controller-first-person-desktop';

export default {
  name: 'SkyOrbitSence',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      cube: null,
      clock: null,
      orbitControls: null
    };
  },
  mounted() {
    this.initSence();
    this.addBaseBox();
  },
  methods: {
    initSence() {
      this.scene = new THREE.Scene();
      this.clock = new THREE.Clock(true);
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      this.camera.lookAt(new THREE.Vector3())
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      this.orbitControls = new ComboControls(this.camera, this.renderer.domElement);
      document.body.appendChild( this.renderer.domElement );
    },
    addBaseBox() {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(require("../../assets/logo.png"), (texture) => {
        const geometry = new THREE.SphereGeometry( 10, 100, 100 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture } );
        material.side = THREE.BackSide;
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
        this.camera.position.z = 0;

        this.renderSence();
      });
    },
    renderSence() {
      requestAnimationFrame( this.renderSence );
      this.orbitControls.update(this.clock.getDelta());
      this.renderer.render( this.scene, this.camera );
    }
  }
}
</script>

<style scoped>
</style>
