<template>
  <div>
    
  </div>
</template>

<script>
import THREELIB from "three-js";
var THREE = THREELIB();

export default {
  name: 'BaseSence',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      cube: null
    };
  },
  mounted() {
    this.initSence();
    this.addBaseBox();
    this.renderSence();
  },
  methods: {
    initSence() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
      document.body.appendChild( this.renderer.domElement );
    },
    addBaseBox() {
      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      this.cube = new THREE.Mesh( geometry, material );
      this.cube.position.y = 2;
      this.scene.add( this.cube );

      this.camera.position.z = 5;
    },
    renderSence() {
      requestAnimationFrame( this.renderSence );
      this.cube.rotation.x += 0.1;
      this.renderer.render( this.scene, this.camera );
    }
  }
}
</script>

<style scoped>
</style>
