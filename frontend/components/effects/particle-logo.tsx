"use client";
import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";

// Renders `text` sampled to points, drifting into place. Minimal ogl point cloud.
export function ParticleLogo({ text }: { text: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const renderer = new Renderer({ alpha: true, dpr: Math.min(2, window.devicePixelRatio) });
    const gl = renderer.gl;
    el.appendChild(gl.canvas);
    const camera = new Camera(gl, { fov: 35 });
    camera.position.z = 5;
    const scene = new Transform();

    // Sample text into points on an offscreen 2D canvas.
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 96px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 10, 64);
    const img = ctx.getImageData(0, 0, c.width, c.height).data;
    const pts: number[] = [];
    for (let y = 0; y < c.height; y += 3)
      for (let x = 0; x < c.width; x += 3)
        if (img[(y * c.width + x) * 4 + 3] > 128) {
          pts.push((x / c.width - 0.5) * 6, -(y / c.height - 0.5) * 1.6, 0);
        }
    const position = new Float32Array(pts);
    const geometry = new Geometry(gl, { position: { size: 3, data: position } });
    const program = new Program(gl, {
      vertex: `attribute vec3 position; uniform mat4 modelViewMatrix, projectionMatrix;
        void main(){ gl_PointSize=2.0; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragment: `precision highp float; void main(){ gl_FragColor=vec4(0.85,0.9,1.0,1.0);} `,
    });
    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    mesh.setParent(scene);

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.perspective({ aspect: el.clientWidth / el.clientHeight });
    };
    resize();
    window.addEventListener("resize", resize);
    let raf = 0;
    const loop = (t: number) => {
      mesh.rotation.y = Math.sin(t * 0.0003) * 0.2;
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      el.removeChild(gl.canvas);
    };
  }, [text]);
  return <div ref={host} className="h-40 w-full" />;
}
