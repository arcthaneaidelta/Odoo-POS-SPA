import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Sparkles, Wind } from 'lucide-react';

interface LiveAmbientHeroBackgroundProps {
  posterImage?: string;
  videoSrc?: string;
}

export const LiveAmbientHeroBackground: React.FC<LiveAmbientHeroBackgroundProps> = ({
  posterImage = '/images/hero_ambient_landscape.jpg',
  videoSrc = '/videos/hero-ambient.mp4',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 850);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 850;
    };

    window.addEventListener('resize', handleResize);

    // 50 floating sunlight motes and glowing alpine mist particles
    const particleCount = 50;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
      hue: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 0.8,
        vx: (Math.random() - 0.25) * 0.5,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        hue: Math.random() > 0.35 ? 45 : 155, // Gold sunlight or emerald foliage glow
      });
    }

    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      if (!isPlaying) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha > 0.8 || p.alpha < 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive cursor breeze
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.8;
          p.y -= (dy / dist) * 1.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 45
            ? `rgba(253, 224, 71, ${p.alpha * 0.75})`
            : `rgba(110, 231, 183, ${p.alpha * 0.65})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.hue === 45 ? 'rgba(250, 204, 21, 0.6)' : 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Cinematic Ken Burns animated classical oil landscape layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-6%',
          backgroundImage: `url(${posterImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          filter: 'saturate(1.18) brightness(1.02) contrast(1.04)',
          transformOrigin: 'center center',
          animation: isPlaying ? 'kenBurnsSlow 40s ease-in-out infinite alternate' : 'none',
          transition: 'transform 1s ease',
        }}
      />

      {/* Embedded Ambient HTML5 MP4 Video Stream (if supported and playing) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: videoLoaded && isPlaying ? 0.35 : 0,
          mixBlendMode: 'screen',
          filter: 'hue-rotate(60deg) saturate(1.2)',
          transition: 'opacity 1s ease',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Sunlit God-Rays Ambient Light Sweep */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 40% 25%, rgba(254, 240, 138, 0.22) 0%, rgba(16, 185, 129, 0.08) 45%, transparent 75%)',
          animation: isPlaying ? 'ambientLightPulse 10s ease-in-out infinite alternate' : 'none',
        }}
      />

      {/* Live Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Translucent Soft Center Vignette so all content, text, and buttons remain 100% crisp */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 88% 68% at 50% 32%, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.86) 38%, rgba(255, 255, 255, 0.5) 72%, rgba(255, 255, 255, 0.18) 100%)',
        }}
      />

      {/* Bottom seamless blend into features section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 40%, #FFFFFF 100%)',
        }}
      />

      {/* Live Cinema Controls Floating Pill */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 10,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(13, 78, 67, 0.18)',
          borderRadius: '9999px',
          padding: '0.3rem 0.75rem',
          boxShadow: '0 4px 12px rgba(13, 78, 67, 0.08)',
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#0D4E43',
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isPlaying ? '#10B981' : '#94A3B8',
            animation: isPlaying ? 'pulseGlow 2s infinite' : 'none',
          }}
        />
        <span>Live Cinematic BG</span>
        <button
          onClick={togglePlayback}
          style={{
            color: '#0D4E43',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            marginLeft: '0.2rem',
            cursor: 'pointer',
          }}
          title={isPlaying ? 'Pause ambient motion' : 'Resume ambient motion'}
          aria-label={isPlaying ? 'Pause ambient motion' : 'Resume ambient motion'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>

      <style>{`
        @keyframes kenBurnsSlow {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.07) translate(-1.2%, -0.8%);
          }
          100% {
            transform: scale(1.03) translate(0.8%, -1.2%);
          }
        }

        @keyframes ambientLightPulse {
          0% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
          }
          100% {
            opacity: 0.75;
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  );
};
