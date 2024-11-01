"use client";
import { BuildXScene } from "@opensystemslab/buildx-core";
import { useEffect, useRef } from "react";

let sceneInstanceCount = 0;

const MinimalBuildXScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const instanceId = useRef(++sceneInstanceCount);

  console.log(`[Scene ${instanceId.current}] Component rendering`);

  useEffect(() => {
    console.log(`[Scene ${instanceId.current}] Effect starting`);
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    // Force initial dimensions to match container
    // const width = container.offsetWidth;
    // const height = container.offsetHeight;

    const scene = new BuildXScene({
      canvas: canvasRef.current,
      container: containerRef.current!,
    });

    // Set size with exact dimensions
    // renderer.setSize(width, height, true); // true to update style

    // Position camera to see cube properly
    // camera.position.z = 3; // Reduced from 5 to make cube more visible in smaller container

    // console.log(`[Scene ${instanceId.current}] Created new THREE instances:`, {
    //   scene: scene.id,
    //   camera: camera.id,
    //   renderer: "WebGLRenderer_" + instanceId.current,
    // });

    // Create cube
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    // console.log(`[Scene ${instanceId.current}] Created cube:`, {
    //   geometryId: geometry.id,
    //   materialId: material.id,
    //   meshId: cube.id,
    // });

    // Add lights
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // const pointLight = new THREE.PointLight(0xffffff, 1);
    // pointLight.position.set(5, 5, 5);
    // scene.add(ambientLight);
    // scene.add(pointLight);
    // console.log(`[Scene ${instanceId.current}] Added lights:`, {
    //   ambientLightId: ambientLight.id,
    //   pointLightId: pointLight.id,
    // });

    // Animation loop
    // let frameId: number;
    // function animate() {
    //   frameId = requestAnimationFrame(animate);
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    //   renderer.render(scene, camera);
    // }
    // animate();
    // console.log(`[Scene ${instanceId.current}] Started animation loop`);

    // Update resize handler to use container dimensions
    // function handleResize() {
    //   if (!canvasRef.current?.parentElement) return;
    //   const width = canvasRef.current.parentElement.offsetWidth;
    //   const height = canvasRef.current.parentElement.offsetHeight;

    //   camera.aspect = width / height;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(width, height, true);
    // }

    // Use ResizeObserver instead of window.resize
    // const resizeObserver = new ResizeObserver(handleResize);
    // resizeObserver.observe(container);

    // Cleanup
    return () => {
      // console.log(`[Scene ${instanceId.current}] Cleanup starting`);

      // resizeObserver.disconnect();
      // console.log(`[Scene ${instanceId.current}] Removed resize listener`);

      // cancelAnimationFrame(frameId);
      // console.log(`[Scene ${instanceId.current}] Cancelled animation frame`);

      // Dispose of Three.js objects
      // geometry.dispose();
      // material.dispose();
      // renderer.dispose();
      scene.dispose();

      // console.log(
      //   `[Scene ${instanceId.current}] Disposed of Three.js objects:`,
      //   {
      //     geometryId: geometry.id,
      //     materialId: material.id,
      //     rendererId: "WebGLRenderer_" + instanceId.current,
      //   }
      // );

      // Log memory info if available
      // if (renderer.info) {
      //   console.log(
      //     // eslint-disable-next-line react-hooks/exhaustive-deps
      //     `[Scene ${instanceId.current}] Renderer memory before disposal:`,
      //     {
      //       geometries: renderer.info.memory.geometries,
      //       textures: renderer.info.memory.textures,
      //       programs: renderer.info.programs?.length || 0,
      //     }
      //   );
      // }

      // console.log(`[Scene ${instanceId.current}] Cleanup complete`);
    };
  }, []);

  // console.log(`[Scene ${instanceId.current}] Render complete`);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default MinimalBuildXScene;
