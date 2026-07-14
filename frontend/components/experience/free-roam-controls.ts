"use client";

// Mutating the three.js camera imperatively inside useFrame is the canonical R3F
// pattern — three objects live outside React's render model, so the React 19
// immutability lint is a false positive here. Disabled file-wide by intent.
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Euler } from "three";

// First-person free-roam for the Canvas camera. Pointer-lock look + WASD move
// on the XZ plane at fixed eye height. No physics — MVP keeps it robust.
// ponytail: flat-floor walker, add rapier controller only if collisions matter.

const EYE_HEIGHT = 1.7;
const SPEED = 4; // units/s
const MAX_DIST = 28; // horizontal clamp from origin
const PITCH_LIMIT = (85 * Math.PI) / 180;

export function useFreeRoam(active: boolean): void {
  const { camera, gl } = useThree();

  // Look angles + pressed keys survive frames without triggering re-render.
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    if (!active) return;
    const el = gl.domElement;

    // Seed look angles from current camera so entering roam doesn't snap.
    euler.current.setFromQuaternion(camera.quaternion);
    yaw.current = euler.current.y;
    pitch.current = euler.current.x;

    const onClick = () => el.requestPointerLock?.();
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== el) return;
      yaw.current -= e.movementX * 0.0025;
      pitch.current -= e.movementY * 0.0025;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    el.addEventListener("click", onClick);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      el.removeEventListener("click", onClick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      keys.current = {};
      if (document.pointerLockElement === el) document.exitPointerLock?.();
    };
  }, [active, camera, gl]);

  useFrame((_, dt) => {
    if (!active) return;

    // Apply look.
    euler.current.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler.current);

    // Movement input on the XZ plane relative to yaw.
    const k = keys.current;
    let fwd = 0;
    let strafe = 0;
    if (k.KeyW) fwd += 1;
    if (k.KeyS) fwd -= 1;
    if (k.KeyD) strafe += 1;
    if (k.KeyA) strafe -= 1;

    if (fwd !== 0 || strafe !== 0) {
      const sin = Math.sin(yaw.current);
      const cos = Math.cos(yaw.current);
      // forward = -Z in view space → world (-sin, 0, -cos); right = (cos,0,-sin)
      let dx = -sin * fwd + cos * strafe;
      let dz = -cos * fwd - sin * strafe;
      const len = Math.hypot(dx, dz) || 1;
      const speed = SPEED * (k.ShiftLeft ? 2 : 1) * dt;
      dx = (dx / len) * speed;
      dz = (dz / len) * speed;

      camera.position.x += dx;
      camera.position.z += dz;

      // Clamp horizontal distance so the player stays in-world.
      const dist = Math.hypot(camera.position.x, camera.position.z);
      if (dist > MAX_DIST) {
        camera.position.x = (camera.position.x / dist) * MAX_DIST;
        camera.position.z = (camera.position.z / dist) * MAX_DIST;
      }
    }

    camera.position.y = EYE_HEIGHT;
  });
}
