import React, { useRef, useEffect } from 'react';

export const ThreeShowcase: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse input with easing
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Map to -1 to 1 range
      mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = ((e.clientY - rect.top) / height) * 2 - 1;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = ((e.touches[0].clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = ((e.touches[0].clientY - rect.top) / height) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Icosahedron mathematics
    const phi = (1 + Math.sqrt(5)) / 2;
    // 12 Vertices
    const rawVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    // Normalize vertices to sit on a unit sphere
    const vertices = rawVertices.map(v => {
      const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      return [v[0] / len, v[1] / len, v[2] / len] as [number, number, number];
    });

    // 20 Triangles defining the faces
    const faces: [number, number, number][] = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    let rotX = 0;
    let rotY = 0;
    let pulseAngle = 0;

    // Golden metallic colors
    // linear-gradient(135deg, #a8893a 0%, #C9A84C 50%, #e0c070 100%)
    const goldDiff = '#C9A84C';
    const goldShadow = '#a8893a';
    const goldHigh = '#e0c070';

    // Particle field
    const particles = Array.from({ length: 40 }, () => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 300,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
    }));

    // Main Renderer Game Loop
    const draw = () => {
      // Background clean clear
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse with damping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Base rotation + mouse deviation
      rotX += 0.005 + mouse.y * 0.01;
      rotY += 0.007 + mouse.x * 0.01;
      pulseAngle += 0.02;

      const sizeScale = Math.min(width, height) * 0.32;
      const wave = Math.sin(pulseAngle) * 0.08;

      // Define 3D rotation matrices
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const rotate = (v: [number, number, number]): [number, number, number] => {
        // Rotate Y
        let x = v[0] * cosY - v[2] * sinY;
        let z = v[0] * sinY + v[2] * cosY;
        // Rotate X
        let y = v[1] * cosX - z * sinX;
        z = v[1] * sinX + z * cosX;
        return [x, y, z];
      };

      // Project 3D points to screen coordinates
      const projVertices = vertices.map(v => {
        // Apply vertices breathing deformation
        const rFactor = 1.0 + wave * (v[0] * v[1]);
        const rotated = rotate([v[0] * rFactor, v[1] * rFactor, v[2] * rFactor]);
        
        // Perspective projection
        const d = 3; // camera distance
        const pers = d / (d - rotated[2]);
        const rx = width / 2 + rotated[0] * sizeScale * pers;
        const ry = height / 2 + rotated[1] * sizeScale * pers;
        return { x: rx, y: ry, rotatedZ: rotated[2], rotated3d: rotated };
      });

      // Render Floating Luxury Particles
      ctx.fillStyle = 'rgba(201, 168, 76, 0.45)';
      particles.forEach(p => {
        p.z += p.speed;
        if (p.z > 150) p.z = -150;

        let px = p.x;
        let py = p.y;
        let pz = p.z;

        // Briefly rotate particles with model
        const cosY_P = Math.cos(rotY * 0.3);
        const sinY_P = Math.sin(rotY * 0.3);
        const rx = px * cosY_P - pz * sinY_P;
        const rz = px * sinY_P + pz * cosY_P;

        const pd = 300;
        const ppers = pd / (pd + rz);
        const sx = width / 2 + rx * ppers;
        const sy = height / 2 + py * ppers;

        const radius = p.size * (1 + rz / 150);
        if (sx > 0 && sx < width && sy > 0 && sy < height && radius > 0) {
          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Depth sort faces (Painter's Algorithm)
      const sortedFaces = faces
        .map((f, index) => {
          const zAvg = (projVertices[f[0]].rotatedZ + projVertices[f[1]].rotatedZ + projVertices[f[2]].rotatedZ) / 3;
          return { face: f, zAvg, index };
        })
        .sort((a, b) => a.zAvg - b.zAvg);

      // Spot Light Source vector
      const light = { x: 0.5, y: -0.8, z: 1.0 };
      const lightLen = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
      const lightN = { x: light.x / lightLen, y: light.y / lightLen, z: light.z / lightLen };

      // Render Faces
      sortedFaces.forEach(({ face }) => {
        const p1 = projVertices[face[0]];
        const p2 = projVertices[face[1]];
        const p3 = projVertices[face[2]];

        // Calculate face normal vector
        const ux = p2.rotated3d[0] - p1.rotated3d[0];
        const uy = p2.rotated3d[1] - p1.rotated3d[1];
        const uz = p2.rotated3d[2] - p1.rotated3d[2];

        const vx = p3.rotated3d[0] - p1.rotated3d[0];
        const vy = p3.rotated3d[1] - p1.rotated3d[1];
        const vz = p3.rotated3d[2] - p1.rotated3d[2];

        // Cross product
        const nx = uy * vz - uz * vy;
        const ny = uz * vx - ux * vz;
        const nz = ux * vy - uy * vx;
        const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
        const nn = { x: nx / nLen, y: ny / nLen, z: nz / nLen };

        // Back-face Culling (Nz > 0 is pointing towards us)
        if (nn.z < -0.1) return;

        // Calculate illumination diffuse spotlight intensity (0 to 1)
        const dot = nn.x * lightN.x + nn.y * lightN.y + nn.z * lightN.z;
        const intensity = Math.max(0, (dot + 1) / 2); // Map to 0-1 range

        // Drawing paths
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        // Create metallic lustrous gold gradient on the vector
        const midX = (p1.x + p2.x + p3.x) / 3;
        const midY = (p1.y + p2.y + p3.y) / 3;
        const grad = ctx.createLinearGradient(midX - 50, midY - 50, midX + 50, midY + 50);

        // Blending metallic gold steps dynamically based on illumination
        const color1 = blendHex(goldShadow, goldDiff, intensity);
        const color2 = blendHex(goldDiff, goldHigh, intensity);
        const color3 = blendHex(goldShadow, goldHigh, intensity * 0.6);

        grad.addColorStop(0, color1);
        grad.addColorStop(0.5, color2);
        grad.addColorStop(1, color3);

        ctx.fillStyle = grad;
        // Make mesh slightly translucent to see clean layered wireframe
        ctx.globalAlpha = 0.88;
        ctx.fill();

        // Draw elegant wireframe lines
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = '#FCF6BA';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    // Helper to blend hex colors based on intensity factor (0 - 1)
    function blendHex(c1: string, c2: string, factor: number): string {
      const getRGB = (hex: string) => {
        const num = parseInt(hex.replace('#', ''), 16);
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255
        };
      };
      const r1 = getRGB(c1);
      const r2 = getRGB(c2);
      const r = Math.round(r1.r + (r2.r - r1.r) * factor);
      const g = Math.round(r1.g + (r2.g - r1.g) * factor);
      const b = Math.round(r1.b + (r2.b - r1.b) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    }

    // Trigger loop start
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] select-none pointer-events-none cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-auto block"
        style={{ touchAction: 'none' }}
      />
      {/* Decorative Gold Radial Shadow Backdrop */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none" />
    </div>
  );
};
