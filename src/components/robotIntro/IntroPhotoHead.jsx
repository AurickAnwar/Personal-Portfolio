import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import profilePhoto from '../../assets/profilePhoto';
import { easeOutCubic, mountProgress } from './assemblyUtils';
import { PART_ANCHORS } from './assemblyPartGeometries';

function fitCoverTexture(texture) {
  const image = texture.image;
  if (!image?.width || !image?.height) return texture;

  const tex = texture.clone();
  tex.needsUpdate = true;

  const imageAspect = image.width / image.height;
  if (imageAspect > 1) {
    tex.repeat.set(1 / imageAspect, 1);
    tex.offset.set((1 - 1 / imageAspect) * 0.5, 0);
  } else {
    tex.repeat.set(1, imageAspect);
    tex.offset.set(0, (1 - imageAspect) * 0.5);
  }

  return tex;
}

/** Lite intro — circular profile photo mounted on the block suit torso. */
export default function IntroPhotoHead({ progress }) {
  const rootRef = useRef();
  const source = useTexture(profilePhoto);
  const map = useMemo(() => fitCoverTexture(source), [source]);
  const mount = mountProgress(progress / 100, 0.46, 0.6);
  const [x, y, z] = PART_ANCHORS.mask;

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;

    const t = easeOutCubic(mount);
    root.visible = t > 0.02;
    root.scale.setScalar(0.35 + t * 0.65);

    root.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material.transparent = t < 0.995;
      child.material.opacity = t;
    });
  });

  return (
    <group ref={rootRef} position={[x, y, z]}>
      <mesh position={[0, 0, -0.004]} renderOrder={1}>
        <ringGeometry args={[0.088, 0.108, 48]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} transparent opacity={0.95} />
      </mesh>
      <mesh renderOrder={2}>
        <circleGeometry args={[0.088, 48]} />
        <meshBasicMaterial map={map} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}
