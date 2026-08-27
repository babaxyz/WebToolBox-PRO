import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(2.15, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x6ee7f9,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const inner = new THREE.IcosahedronGeometry(1.45, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xb7ef79,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const innerMesh = new THREE.Mesh(inner, innerMaterial);
    group.add(innerMesh);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.7 + Math.random() * 1.5;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(b) * Math.cos(a);
      positions[i * 3 + 1] = r * Math.cos(b);
      positions[i * 3 + 2] = r * Math.sin(b) * Math.sin(a);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0x9ee8ff,
        size: 0.025,
        transparent: true,
        opacity: 0.55
      })
    );
    group.add(particles);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += 0.0028;
      group.rotation.x = Math.sin(Date.now() * 0.00035) * 0.08;
      innerMesh.rotation.y -= 0.004;
      particles.rotation.y -= 0.0015;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      inner.dispose();
      innerMaterial.dispose();
      particlesGeometry.dispose();
      particles.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="hero-scene" aria-hidden="true" />;
}
