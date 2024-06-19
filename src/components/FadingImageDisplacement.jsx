import * as THREE from "three";
import React from "react";
import { useRef, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { geometry, easing } from "maath";

export const ImageFadeMaterialDisplacement = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
  },
  /* glsl */ ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  /* glsl */ ` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
    }`
);

extend({
  ImageFadeMaterialDisplacement,
  RoundedPlaneGeometry: geometry.RoundedPlaneGeometry,
});

export const FadingImageDisplacement = (props) => {
  const ref = useRef();
  const [texture1, texture2, dispTexture] = useTexture([
    "/textures/traditional.png",
    "/textures/magician.png",
    "/textures/displacement/3.jpg",
  ]);
  const [hovered, setHover] = useState(false);
  useFrame((_state, delta) => {
    easing.damp(ref.current, "dispFactor", hovered ? 1 : 0, 0.1, delta);
  });

  return (
    <mesh
      {...props}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <roundedPlaneGeometry args={[2.25, 4]} />
      <imageFadeMaterialDisplacement
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        toneMapped={false}
      />
    </mesh>
  );
};
