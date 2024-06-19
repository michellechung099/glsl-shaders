import * as THREE from "three";
import React from "react";
import { useRef, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { easing } from "maath";

export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
  },
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  ` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;

    float rand(vec2 n) { 
	    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	  return res*res;
    }

    void main() {
      vec2 uv = vUv;
      float noiseFactor = noise(gl_FragCoord.xy * 0.4);
      vec2 distortedPosition = vec2(uv.x + dispFactor * noiseFactor, uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * noiseFactor, uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
    }`
);

extend({
  ImageFadeMaterial,
});

export const Fading = (props) => {
  const ref = useRef();
  const [texture1, texture2] = useTexture([
    "/textures/cyberpunk.png",
    "/textures/mecha.png",
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
      <imageFadeMaterial
        ref={ref}
        tex={texture1}
        tex2={texture2}
        toneMapped={false}
      />
    </mesh>
  );
};
