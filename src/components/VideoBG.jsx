import React, { useRef, useEffect, useState, useCallback } from 'react';
import './VideoBG.css';
import videoIntro from '../assets/bg-intro.mp4';
import videoLoop from '../assets/bg-video.mp4';

export default function VideoBG({ onIntroComplete }) {
  const introRef = useRef(null);
  const loopA = useRef(null);
  const loopB = useRef(null);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'A' | 'B'
  const switchingRef = useRef(false);

  // Handle intro -> first loop transition
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    intro.play().catch(() => { });

    const onTimeUpdate = () => {
      if (intro.duration && intro.duration - intro.currentTime <= 0.8) {
        intro.removeEventListener('timeupdate', onTimeUpdate);
        // Start loop A and crossfade
        const a = loopA.current;
        if (a) {
          a.currentTime = 0;
          a.play().catch(() => { });
        }
        setPhase('A');
        if (onIntroComplete) onIntroComplete();
      }
    };

    intro.addEventListener('timeupdate', onTimeUpdate);
    return () => intro.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  // Handle loop A <-> B seamless crossfade
  const handleLoopTimeUpdate = useCallback((currentRef, nextRef, nextLabel) => {
    const current = currentRef.current;
    const next = nextRef.current;
    if (!current || !next || switchingRef.current) return;
    if (current.duration && current.duration - current.currentTime <= 0.8) {
      switchingRef.current = true;
      next.currentTime = 0;
      next.play().catch(() => { });
      setPhase(nextLabel);
      setTimeout(() => { switchingRef.current = false; }, 1000);
    }
  }, []);

  useEffect(() => {
    const a = loopA.current;
    const b = loopB.current;
    if (!a || !b) return;

    const onTimeA = () => handleLoopTimeUpdate(loopA, loopB, 'B');
    const onTimeB = () => handleLoopTimeUpdate(loopB, loopA, 'A');

    a.addEventListener('timeupdate', onTimeA);
    b.addEventListener('timeupdate', onTimeB);

    return () => {
      a.removeEventListener('timeupdate', onTimeA);
      b.removeEventListener('timeupdate', onTimeB);
    };
  }, [handleLoopTimeUpdate]);

  return (
    <div className="video-bg-container">
      {/* Intro video - plays once */}
      <video
        ref={introRef}
        className={`video-bg-layer ${phase === 'intro' ? 'active' : ''}`}
        src={videoIntro}
        muted
        playsInline
        preload="auto"
      />
      {/* Loop video A */}
      <video
        ref={loopA}
        className={`video-bg-layer ${phase === 'A' ? 'active' : ''}`}
        src={videoLoop}
        muted
        playsInline
        preload="auto"
      />
      {/* Loop video B */}
      <video
        ref={loopB}
        className={`video-bg-layer ${phase === 'B' ? 'active' : ''}`}
        src={videoLoop}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
