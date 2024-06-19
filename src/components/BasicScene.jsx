import { OrbitControls } from "@react-three/drei";
import { FadingImageDisplacement } from "./FadingImageDisplacement.jsx";
import { Fading } from "./Fading.jsx";

export const BasicScene = () => {
  return (
    <>
      <OrbitControls />
      <FadingImageDisplacement position-x={1.5} position-z={-2} />
      <Fading position-x={-1.5} position-z={-2} />
    </>
  );
};
