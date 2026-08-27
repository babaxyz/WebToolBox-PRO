import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.BoxGeometry(1.15, 1.15, 1.15);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xb7ef79, roughness: 0.28, metalness: 0.12 }),
      new THREE.MeshStandardMaterial({ color: 0x8ddff3, roughness: 0.3, metalness: 0.18 }),
      new THREE.MeshStandardMaterial({ color: 0xff9b83, roughness: 0.32, metalness: 0.12 })
    ];
    const cubes = materials.map((material, index) => {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(index * 1.45 - 1.45, index === 1 ? 0.9 : -0.35, index * -0.35);
      cube.rotation.set(index * 0.4, index * 0.55, index * -0.22);
      group.add(cube);
      return cube;
    });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.8, 3.5, 1.5)), new THREE.LineBasicMaterial({ color: 0x7895b5, transparent: true, opacity: 0.22 }));
    edges.position.z = -0.9;
    group.add(edges);
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xb7ef79, 2.4);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x78a9ff, 16, 12);
    rim.position.set(-4, 1, 4);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const resize = () => {
      const width = mount.clientWidth || 500;
      const height = mount.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    let frame = 0;
    const animate = (time) => {
      frame = requestAnimationFrame(animate);
      const seconds = time * 0.001;
      group.rotation.y += (pointer.x * 0.18 - group.rotation.y) * 0.025;
      group.rotation.x += (-pointer.y * 0.1 - group.rotation.x) * 0.025;
      cubes.forEach((cube, index) => {
        cube.position.y += Math.sin(seconds * 1.4 + index) * 0.0018;
        cube.rotation.x += 0.002 + index * 0.0005;
        cube.rotation.z -= 0.0015;
      });
      edges.rotation.z = Math.sin(seconds * 0.35) * 0.04;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      edges.geometry.dispose();
      edges.material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-scene" ref={mountRef} aria-hidden="true" />;
}
