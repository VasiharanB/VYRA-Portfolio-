/**
 * Script to fetch, convert and optimize authentic Staunton 3D models (King, Queen, Rook, Bishop, Pawn)
 * from clarkerubber/Staunton-Pieces (official Lichess 3D set, MIT License).
 *
 * Sourced directly from: https://github.com/clarkerubber/Staunton-Pieces
 */

global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
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

const PIECES = [
  {
    name: 'King',
    url: 'https://raw.githubusercontent.com/clarkerubber/Staunton-Pieces/master/Source/Staunton/King/King.STL',
    outFile: 'public/models/staunton-king.glb',
    targetHeight: 3.4,
    creaseAngle: 42,
  },
  {
    name: 'Queen',
    url: 'https://raw.githubusercontent.com/clarkerubber/Staunton-Pieces/master/Source/Staunton/Queen/Queen.STL',
    outFile: 'public/models/staunton-queen.glb',
    targetHeight: 3.0,
    creaseAngle: 42,
  },
  {
    name: 'Bishop',
    url: 'https://raw.githubusercontent.com/clarkerubber/Staunton-Pieces/master/Source/Staunton/Bishop/Bishop.STL',
    outFile: 'public/models/staunton-bishop.glb',
    targetHeight: 2.6,
    creaseAngle: 42,
  },
  {
    name: 'Rook',
    url: 'https://raw.githubusercontent.com/clarkerubber/Staunton-Pieces/master/Source/Staunton/Rook/Rook.STL',
    outFile: 'public/models/staunton-rook.glb',
    targetHeight: 2.2,
    creaseAngle: 38,
  },
  {
    name: 'Pawn',
    url: 'https://raw.githubusercontent.com/clarkerubber/Staunton-Pieces/master/Source/Staunton/Pawn/Pawn.STL',
    outFile: 'public/models/staunton-pawn.glb',
    targetHeight: 1.8,
    creaseAngle: 42,
  },
];

async function convertPiece(piece) {
  console.log(`\n--- Processing ${piece.name} ---`);
  console.log(`Fetching from: ${piece.url}`);
  const res = await fetch(piece.url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${piece.url}: ${res.statusText}`);
  }
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

  // Normalize height to targetHeight units
  const currentHeight = bb.max.y - bb.min.y;
  const scale = piece.targetHeight / currentHeight;
  geom.scale(scale, scale, scale);

  // Compute smooth creased normals
  geom = BufferGeometryUtils.toCreasedNormals(geom, THREE.MathUtils.degToRad(piece.creaseAngle));

  const mat = new THREE.MeshStandardMaterial({
    color: 0x58626c,
    roughness: 0.28,
    metalness: 0.78,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = `Staunton${piece.name}`;

  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      mesh,
      (gltf) => {
        fs.writeFileSync(piece.outFile, Buffer.from(gltf));
        const stats = fs.statSync(piece.outFile);
        console.log(`Saved ${piece.outFile} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

async function main() {
  fs.mkdirSync('public/models', { recursive: true });
  for (const piece of PIECES) {
    await convertPiece(piece);
  }
  console.log('\nAll 5 Staunton pieces converted successfully!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
