import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMode } from '../types';

interface OrnamentsProps {
  mode: TreeMode;
  count: number;
}

type OrnamentType = 'ball' | 'gift' | 'light' | 'blueLight' | 'redParticle' | 'snowflake';

interface InstanceData {
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  type: OrnamentType;
  color: THREE.Color;
  scale: number;
  speed: number;
  rotationOffset: THREE.Euler;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitHeight?: number;
  fallSpeed?: number;
  horizontalDrift?: number;
  resetHeight?: number;
}

export const Ornaments: React.FC<OrnamentsProps> = ({ mode, count }) => {
  // We use 6 separate InstancedMeshes for different geometries/materials to reduce draw calls
  // but allow unique shapes.
  const ballsRef = useRef<THREE.InstancedMesh>(null);
  const giftsRef = useRef<THREE.InstancedMesh>(null);
  const lightsRef = useRef<THREE.InstancedMesh>(null);
  const blueLightsRef = useRef<THREE.InstancedMesh>(null);
  const redParticlesRef = useRef<THREE.InstancedMesh>(null);
  const snowflakesRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate data once
  const { ballsData, giftsData, lightsData, blueLightsData, redParticlesData, snowflakesData } = useMemo(() => {
    const _balls: InstanceData[] = [];
    const _gifts: InstanceData[] = [];
    const _lights: InstanceData[] = [];
    const _blueLights: InstanceData[] = [];
    const _redParticles: InstanceData[] = [];
    const _snowflakes: InstanceData[] = [];

    const height = 11; // Slightly smaller than foliage
    const maxRadius = 4.5;
    
    // Luxury Colors
    const gold = new THREE.Color("#D4AF37");
    const red = new THREE.Color("#8B0000"); // Dark Velvet Red
    const emerald = new THREE.Color("#004422");
    const whiteGold = new THREE.Color("#F5E6BF");
    
    const palette = [gold, red, gold, whiteGold];

    for (let i = 0; i < count; i++) {
      const rnd = Math.random();
      let type: OrnamentType = 'ball'; // 50% balls (0-0.5)
      if (rnd >= 0.5 && rnd < 0.8) type = 'gift'; // 30% gifts (0.5-0.8)
      if (rnd >= 0.8 && rnd < 0.9) type = 'light'; // 10% yellow lights (0.8-0.9)
      if (rnd >= 0.9) type = 'blueLight'; // 10% blue lights (0.9-1.0)

      // 1. Target Position (Spiral with heavy density at bottom)
      // Use power function to bias distribution toward bottom (lower yNorm values)
      const yNorm = Math.pow(Math.random(), 2.5); // Heavy concentration at bottom
      const y = yNorm * height + 0.5;
      const rScale = (1 - yNorm);
      const theta = y * 10 + Math.random() * Math.PI * 2; // Wind around

      // Push ornaments closer to the foliage for better coverage
      const r = maxRadius * rScale * 1 + (Math.random() * 0.5);
      
      const targetPos = new THREE.Vector3(
        r * Math.cos(theta),
        y,
        r * Math.sin(theta)
      );

      // 2. Chaos Position
      const cR = 15 + Math.random() * 15;
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const chaosPos = new THREE.Vector3(
        cR * Math.sin(cPhi) * Math.cos(cTheta),
        cR * Math.sin(cPhi) * Math.sin(cTheta) + 5,
        cR * Math.cos(cPhi)
      );

      const scale = (type === 'light' || type === 'blueLight') ? 0.1 : (0.13 + Math.random() * 0.08);
      let color: THREE.Color;
      if (type === 'light') {
        color = new THREE.Color("#FFFFAA"); // Yellow light
      } else if (type === 'blueLight') {
        color = new THREE.Color("#4488FF"); // Blue light
      } else {
        color = palette[Math.floor(Math.random() * palette.length)];
      }

      const data: InstanceData = {
        chaosPos,
        targetPos,
        type,
        color,
        scale,
        speed: 0.5 + Math.random() * 1.5, // Random speed for physics feel
        rotationOffset: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      };

      if (type === 'ball') _balls.push(data);
      else if (type === 'gift') _gifts.push(data);
      else if (type === 'light') _lights.push(data);
      else if (type === 'blueLight') _blueLights.push(data);
    }

    // ============ RED PARTICLES CONFIG ============
    // 红色光点围绕圣诞树飞行
    const RED_PARTICLE_COUNT = 50; // 红色粒子数量（可调整）
    const RED_ORBIT_RADIUS_MIN = 2; // 轨道最小半径
    const RED_ORBIT_RADIUS_MAX = 6; // 轨道最大半径
    const RED_HEIGHT_MIN = 0; // 最小高度
    const RED_HEIGHT_MAX = 8; // 最大高度
    const RED_ORBIT_SPEED_MIN = 0.3; // 最小飞行速度
    const RED_ORBIT_SPEED_MAX = 0.8; // 最大飞行速度
    // ============================================

    for (let i = 0; i < RED_PARTICLE_COUNT; i++) {
      const orbitRadius = RED_ORBIT_RADIUS_MIN + Math.random() * (RED_ORBIT_RADIUS_MAX - RED_ORBIT_RADIUS_MIN);
      const orbitHeight = RED_HEIGHT_MIN + Math.random() * (RED_HEIGHT_MAX - RED_HEIGHT_MIN);
      const orbitSpeed = RED_ORBIT_SPEED_MIN + Math.random() * (RED_ORBIT_SPEED_MAX - RED_ORBIT_SPEED_MIN);
      const startAngle = Math.random() * Math.PI * 2;

      // Initial position in orbit
      const targetPos = new THREE.Vector3(
        Math.cos(startAngle) * orbitRadius,
        orbitHeight,
        Math.sin(startAngle) * orbitRadius
      );

      // Chaos position (same as other ornaments)
      const cR = 15 + Math.random() * 15;
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const chaosPos = new THREE.Vector3(
        cR * Math.sin(cPhi) * Math.cos(cTheta),
        cR * Math.sin(cPhi) * Math.sin(cTheta) + 5,
        cR * Math.cos(cPhi)
      );

      const particleData: InstanceData = {
        chaosPos,
        targetPos,
        type: 'redParticle',
        color: new THREE.Color("#FF3333"), // Bright red
        scale: 0.08 + Math.random() * 0.05,
        speed: 0.5 + Math.random() * 1.0,
        rotationOffset: new THREE.Euler(0, 0, 0),
        orbitRadius,
        orbitSpeed,
        orbitHeight
      };

      _redParticles.push(particleData);
    }

    // ============ SNOWFLAKES CONFIG ============
    // Bông tuyết rơi từ trên xuống
    const SNOWFLAKE_COUNT = 100; // 雪花数量（可调整）
    const SNOWFLAKE_SPAWN_RADIUS = 15; // 雪花生成区域半径
    const SNOWFLAKE_SPAWN_HEIGHT_MIN = 15; // 雪花生成最小高度
    const SNOWFLAKE_SPAWN_HEIGHT_MAX = 25; // 雪花生成最大高度
    const SNOWFLAKE_FALL_SPEED_MIN = 0.3; // 最小下落速度
    const SNOWFLAKE_FALL_SPEED_MAX = 0.8; // 最大下落速度
    const SNOWFLAKE_DRIFT_MIN = -0.5; // 最小水平偏移（负值=向左）
    const SNOWFLAKE_DRIFT_MAX = 0.5; // 最大水平偏移（正值=向右）
    const SNOWFLAKE_SCALE_MIN = 0.05; // 最小尺寸
    const SNOWFLAKE_SCALE_MAX = 0.15; // 最大尺寸
    const SNOWFLAKE_GROUND_LEVEL = -2; // 地面高度（触地时重置）
    // ============================================

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
      // Random spawn position in a circle above the scene
      const spawnAngle = Math.random() * Math.PI * 2;
      const spawnRadius = Math.random() * SNOWFLAKE_SPAWN_RADIUS;
      const spawnHeight = SNOWFLAKE_SPAWN_HEIGHT_MIN + Math.random() * (SNOWFLAKE_SPAWN_HEIGHT_MAX - SNOWFLAKE_SPAWN_HEIGHT_MIN);

      // Start position with random offset to create continuous falling effect
      const initialY = spawnHeight - Math.random() * (spawnHeight - SNOWFLAKE_GROUND_LEVEL);

      const targetPos = new THREE.Vector3(
        Math.cos(spawnAngle) * spawnRadius,
        initialY,
        Math.sin(spawnAngle) * spawnRadius
      );

      // Chaos position (same as other ornaments)
      const cR = 15 + Math.random() * 15;
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const chaosPos = new THREE.Vector3(
        cR * Math.sin(cPhi) * Math.cos(cTheta),
        cR * Math.sin(cPhi) * Math.sin(cTheta) + 5,
        cR * Math.cos(cPhi)
      );

      const snowflakeData: InstanceData = {
        chaosPos,
        targetPos,
        type: 'snowflake',
        color: new THREE.Color("#FFFFFF"), // White
        scale: SNOWFLAKE_SCALE_MIN + Math.random() * (SNOWFLAKE_SCALE_MAX - SNOWFLAKE_SCALE_MIN),
        speed: 0.5 + Math.random() * 1.0,
        rotationOffset: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        fallSpeed: SNOWFLAKE_FALL_SPEED_MIN + Math.random() * (SNOWFLAKE_FALL_SPEED_MAX - SNOWFLAKE_FALL_SPEED_MIN),
        horizontalDrift: SNOWFLAKE_DRIFT_MIN + Math.random() * (SNOWFLAKE_DRIFT_MAX - SNOWFLAKE_DRIFT_MIN),
        resetHeight: spawnHeight
      };

      _snowflakes.push(snowflakeData);
    }

    return { ballsData: _balls, giftsData: _gifts, lightsData: _lights, blueLightsData: _blueLights, redParticlesData: _redParticles, snowflakesData: _snowflakes };
  }, [count]);

  useLayoutEffect(() => {
    // Set initial colors
    [
      { ref: ballsRef, data: ballsData },
      { ref: giftsRef, data: giftsData },
      { ref: lightsRef, data: lightsData },
      { ref: blueLightsRef, data: blueLightsData },
      { ref: redParticlesRef, data: redParticlesData },
      { ref: snowflakesRef, data: snowflakesData }
    ].forEach(({ ref, data }) => {
      if (ref.current) {
        data.forEach((d, i) => {
          ref.current!.setColorAt(i, d.color);
        });
        ref.current.instanceColor!.needsUpdate = true;
      }
    });
  }, [ballsData, giftsData, lightsData, blueLightsData, redParticlesData, snowflakesData]);

  useFrame((state, delta) => {
    const isFormed = mode === TreeMode.FORMED;
    const time = state.clock.elapsedTime;

    // Helper to update a mesh ref
    const updateMesh = (ref: React.RefObject<THREE.InstancedMesh>, data: InstanceData[]) => {
      if (!ref.current) return;

      let needsUpdate = false;

      data.forEach((d, i) => {
        // Special handling for snowflakes - falling effect
        if (d.type === 'snowflake' && isFormed && d.fallSpeed !== undefined && d.horizontalDrift !== undefined && d.resetHeight !== undefined) {
          ref.current!.getMatrixAt(i, dummy.matrix);
          dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

          // Fall down
          dummy.position.y -= d.fallSpeed * delta;

          // Horizontal drift (wind effect)
          dummy.position.x += d.horizontalDrift * delta;

          // Swaying motion (left-right oscillation)
          dummy.position.x += Math.sin(time * 2 + i) * 0.01;
          dummy.position.z += Math.cos(time * 1.5 + i) * 0.01;

          // Reset to top when reaching ground
          if (dummy.position.y < -2) {
            dummy.position.y = d.resetHeight;
            // Randomize X and Z position slightly on reset
            const resetAngle = Math.random() * Math.PI * 2;
            const resetRadius = Math.random() * 15;
            dummy.position.x = Math.cos(resetAngle) * resetRadius;
            dummy.position.z = Math.sin(resetAngle) * resetRadius;
          }

          // Rotation (spinning while falling)
          dummy.rotation.x += delta * 0.5;
          dummy.rotation.y += delta * 0.3;
          dummy.rotation.z += delta * 0.2;

          dummy.scale.setScalar(d.scale);

          dummy.updateMatrix();
          ref.current!.setMatrixAt(i, dummy.matrix);
          needsUpdate = true;
          return;
        }

        // Special handling for red particles - orbit around tree
        if (d.type === 'redParticle' && isFormed && d.orbitRadius && d.orbitSpeed && d.orbitHeight !== undefined) {
          ref.current!.getMatrixAt(i, dummy.matrix);
          dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

          // Calculate orbit position
          const angle = time * d.orbitSpeed + i * 0.5;
          const orbitX = Math.cos(angle) * d.orbitRadius;
          const orbitZ = Math.sin(angle) * d.orbitRadius;
          const targetOrbit = new THREE.Vector3(orbitX, d.orbitHeight, orbitZ);

          // Lerp to orbit position
          dummy.position.lerp(targetOrbit, delta * d.speed);

          // Add floating effect
          dummy.position.y += Math.sin(time * 2 + i) * 0.02;

          // Scale with pulsing effect
          const pulse = 1 + Math.sin(time * 3 + i) * 0.4;
          dummy.scale.setScalar(d.scale * pulse);

          dummy.updateMatrix();
          ref.current!.setMatrixAt(i, dummy.matrix);
          needsUpdate = true;
          return;
        }

        // Interpolation Factor based on individual speed and global delta
        // We use a simple approach: if formed, target is targetPos, else chaosPos
        const dest = isFormed ? d.targetPos : d.chaosPos;
        
        // We actually want to lerp the CURRENT position to the DESTINATION
        // But extracting current position from matrix is expensive every frame for all.
        // Instead, we calculate "current" based on a virtual progress 0-1 driven by state.
        
        // To simulate "physics" (heavy/light), we don't store state per particle here (too complex for this snippet).
        // Instead, we calculate position based on a time-dependent lerp factor.
        
        // However, a simple way to make it feel organic is:
        // Position = Mix(Chaos, Target, SmoothStep(GlobalProgress * speed))
        
        // Let's use a sin wave derived from time for hover, but the main transition is driven by a hidden 'progress' value
        // Since we don't have a global store for animation progress per particle, we approximate using the mode switch time.
        // For a robust system, we'd use a spring library, but here we do manual lerping.

        // Get current matrix position to lerp from? Too expensive.
        // Let's assume a global transition variable `t` that goes 0->1 or 1->0.
        // We will misuse the object's userdata or just calculate purely functional.
        
        // Functional approach:
        // We need an accumulated value. Let's create a visual wobble.
        
        // NOTE: For true interactive physics, we'd use useSprings from react-spring/three, 
        // but for 1000 instances, manual matrix manipulation is better.
        // Here we will simply interpolate between the two static positions based on a "progress" variable
        // that we track manually or approximate.
        
        // Let's read a custom progress from the dataset. 
        // We'll augment the data object with a mutable `currentProgress` property in a closure if possible,
        // but `data` is static.
        
        // Let's just use the `MathUtils.lerp` on the vectors directly inside the loop 
        // by reading the matrix, lerping, writing back.
        ref.current!.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        
        const step = delta * d.speed;
        dummy.position.lerp(dest, step);

        // Add wobble when formed
        if (isFormed && dummy.position.distanceTo(d.targetPos) < 0.5) {
          dummy.position.y += Math.sin(time * 2 + d.chaosPos.x) * 0.002;
        }

        // Rotation
        if (d.type === 'gift') {
           dummy.rotation.x += delta * 0.5;
           dummy.rotation.y += delta * 0.2;
        } else {
           // Balls face out
           dummy.lookAt(0, dummy.position.y, 0);
        }

        dummy.scale.setScalar(d.scale);
        if (d.type === 'light' || d.type === 'blueLight') {
           // Pulsate lights
           const pulse = 1 + Math.sin(time * 5 + d.chaosPos.y) * 0.3;
           dummy.scale.multiplyScalar(pulse);
        }

        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      });

      if (needsUpdate) ref.current.instanceMatrix.needsUpdate = true;
    };

    updateMesh(ballsRef, ballsData);
    updateMesh(giftsRef, giftsData);
    updateMesh(lightsRef, lightsData);
    updateMesh(blueLightsRef, blueLightsData);
    updateMesh(redParticlesRef, redParticlesData);
    updateMesh(snowflakesRef, snowflakesData);
  });

  return (
    <>
      {/* Balls: High Gloss Gold/Red */}
      <instancedMesh ref={ballsRef} args={[undefined, undefined, ballsData.length]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          roughness={0.1} 
          metalness={0.9} 
          envMapIntensity={1.5}
        />
      </instancedMesh>

      {/* Gifts: Cubes with ribbons (simplified as cubes) */}
      <instancedMesh ref={giftsRef} args={[undefined, undefined, giftsData.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          roughness={0.3} 
          metalness={0.5} 
          color="#white" // Tinted by instance color
        />
      </instancedMesh>

      {/* Lights: Emissive small spheres (Yellow) */}
      <instancedMesh ref={lightsRef} args={[undefined, undefined, lightsData.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          emissive="white"
          emissiveIntensity={2}
          toneMapped={false}
          color="white" // Tinted by instance color (yellowish)
        />
      </instancedMesh>

      {/* Blue Lights: Emissive small spheres (Blue) */}
      <instancedMesh ref={blueLightsRef} args={[undefined, undefined, blueLightsData.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          emissive="#4488FF"
          emissiveIntensity={2}
          toneMapped={false}
          color="#4488FF" // Blue tint
        />
      </instancedMesh>

      {/* Red Particles: Orbiting glowing particles */}
      <instancedMesh ref={redParticlesRef} args={[undefined, undefined, redParticlesData.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          emissive="#FF3333"
          emissiveIntensity={3}
          toneMapped={false}
          color="#FF3333" // Bright red
          transparent
          opacity={0.9}
        />
      </instancedMesh>

      {/* Snowflakes: Falling snow particles */}
      <instancedMesh ref={snowflakesRef} args={[undefined, undefined, snowflakesData.length]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </instancedMesh>
    </>
  );
};