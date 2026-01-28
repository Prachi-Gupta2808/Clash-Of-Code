import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export const Vortex = (props) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameId = useRef();
  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  const colors = ["#481E14", "#9B3922", "#F2613F"]; // Custom particle colors

  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  let particleColors = new Array(particleCount); // store color per particle
  let center = [0, 0];

  const TAU = 2 * Math.PI;
  const rand = (n) => n * Math.random();
  const randRange = (n) => n - rand(2 * n);
  const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  const setup = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        resize(canvas, ctx);
        initParticles();
        draw(canvas, ctx);
      }
    }
  };

  const initParticles = () => {
    tick = 0;
    particleProps = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const initParticle = (i) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let x, y, vx, vy, life, ttl, speed, radius;

    x = rand(canvas.width);
    y = center[1] + randRange(rangeY);
    vx = 0;
    vy = 0;
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    speed = baseSpeed + rand(rangeSpeed);
    radius = baseRadius + rand(rangeRadius);

    // Assign random color to this particle
    const colorIndex = Math.floor(Math.random() * colors.length);
    particleColors[i / particlePropCount] = colors[colorIndex];

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, 0], i);
  };

  const draw = (canvas, ctx) => {
    tick++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles(ctx);
    renderGlow(canvas, ctx);
    renderToScreen(canvas, ctx);

    animationFrameId.current = window.requestAnimationFrame(() =>
      draw(canvas, ctx)
    );
  };

  const drawParticles = (ctx) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const updateParticle = (i, ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = i + 1,
      i3 = i + 2,
      i4 = i + 3,
      i5 = i + 4,
      i6 = i + 5,
      i7 = i + 6,
      i8 = i + 7,
      i9 = i + 8;

    let x = particleProps[i];
    let y = particleProps[i2];
    let n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
    let vx = lerp(particleProps[i3], Math.cos(n), 0.5);
    let vy = lerp(particleProps[i4], Math.sin(n), 0.5);
    let life = particleProps[i5];
    let ttl = particleProps[i6];
    let speed = particleProps[i7];
    let x2 = x + vx * speed;
    let y2 = y + vy * speed;
    let radius = particleProps[i8];

    const color = particleColors[i / particlePropCount];
    drawParticle(x, y, x2, y2, life, ttl, radius, color, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    if (checkBounds(x, y, canvas) || life > ttl) initParticle(i);
  };

  const drawParticle = (x, y, x2, y2, life, ttl, radius, color, ctx) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = hexToRgba(color, fadeInOut(life, ttl));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const checkBounds = (x, y, canvas) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const resize = (canvas, ctx) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  };

  const renderGlow = (canvas, ctx) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (canvas, ctx) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) resize(canvas, ctx);
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>
      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
