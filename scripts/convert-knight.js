/**
 * Script to convert and optimize Staunton Knight 3D model from Lichess / clarkerubber
 * for VYRA Strategic Systems 3D Hero.
 *
 * Source: https://github.com/clarkerubber/Staunton-Pieces (MIT License)
 */
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

import fs from 'fs';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

async function main() {
  const stlUrl = 'https://raw.githubusercontent.com/clarkerubber/Staunton-Pieces/master/Source/Staunton/Knight/Knight.STL';
  console.log('Fetching Knight.STL from', stlUrl);
  const res = await fetch(stlUrl);
  const arrayBuf = await res.arrayBuffer();

  const loader = new STLLoader();
  let geom = loader.parse(arrayBuf);

  // Center X and Z, align bottom to Y = 0
  geom.computeBoundingBox();
  const bb = geom.boundingBox;
  const centerX = (bb.min.x + bb.max.x) / 2;
  const centerY = bb.min.y;
  const centerZ = (bb.min.z + bb.max.z) / 2;
  geom.translate(-centerX, -centerY, -centerZ);

  // Normalize height to 2.8 units
  const height = bb.max.y - bb.min.y;
  const scale = 2.8 / height;
  geom.scale(scale, scale, scale);

  // Compute smooth creased normals: smooth curves for head/neck, sharp angles for base rings
  geom = BufferGeometryUtils.toCreasedNormals(geom, THREE.MathUtils.degToRad(42));

  const mat = new THREE.MeshStandardMaterial({
    color: 0x141618,
    roughness: 0.35,
    metalness: 0.82
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = 'StauntonKnight';

  const exporter = new GLTFExporter();
  exporter.parse(
    mesh,
    (gltf) => {
      fs.mkdirSync('public/models', { recursive: true });
      fs.writeFileSync('public/models/staunton-knight.glb', Buffer.from(gltf));
      console.log('Successfully generated public/models/staunton-knight.glb, size:', gltf.byteLength, 'bytes');
    },
    (err) => {
      console.error('Failed to export GLTF:', err);
    },
    { binary: true }
  );
}

main().catch(console.error);
