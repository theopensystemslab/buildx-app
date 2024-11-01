import { proxy, ref } from "valtio";
import type { BuildXScene } from "@opensystemslab/buildx-core";

interface SceneState {
  scene: BuildXScene | null;
}

export const sceneState = proxy<SceneState>({
  scene: null,
});

export const getBuildXScene = (): BuildXScene | null => {
  return sceneState.scene;
};

export const setBuildXScene = (scene: BuildXScene | null) => {
  if (scene) sceneState.scene = ref(scene);
  else sceneState.scene = null;
};
