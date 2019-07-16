/** 
 * @author yaniky
 * @description 全景场景 
 */
<template>
  <div class="panoramic-wrap" ref="demo">
  </div>
</template>

<script>
import * as THREE from 'three';
import { PanoramicControl } from '../controller/PanoramicControl.js';

export default {
  name: 'PanoramicSence',
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
  },
  methods: {
    initSence() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, 500 / 500, 0.1, 1000 );
      new PanoramicControl({
          camera: this.camera,
          tag: this.$refs.demo,
          maxForward: 9,
          maxMove: 100
      });
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( 500, 500 );
      this.$refs.demo.appendChild( this.renderer.domElement );
    },
    addBaseBox() {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(require("../../assets/test.jpg"), (texture) => {
        const geometry = new THREE.SphereGeometry( 100, 100, 100 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture } );
        material.side = THREE.BackSide;
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );

        this.renderSence();
      });
    },
    renderSence() {
      requestAnimationFrame( this.renderSence );
        
      this.renderer.render( this.scene, this.camera );
    }
  }
}
</script>

<style scoped>
.panoramic-wrap {
    width: 500px;
    height: 500px;
}
</style>
