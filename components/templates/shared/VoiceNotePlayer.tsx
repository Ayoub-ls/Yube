'use client';

import { useState, useRef, useEffect } from 'react';
import './VoiceNotePlayer.css';

interface VoiceNotePlayerProps {
  src: string;
  playingAudioSrc: string | null;
  onPlay: (src: string) => void;
  onPause: () => void;
}

export function VoiceNotePlayer({ src, playingAudioSrc, onPlay, onPause }: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingAudioSrc !== src && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [playingAudioSrc, src]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        onPlay(src);
      }).catch((err) => {
        console.error(err);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
      onPause();
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setCurrentTime(audio.currentTime);
      setProgressPercent((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgressPercent(0);
    setCurrentTime(0);
    onPause();
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="voice-note">
      <button
        type="button"
        className={`vn-play-btn ${isPlaying ? "playing" : ""}`}
        onClick={handlePlayPause}
        aria-label="تشغيل التسجيل الصوتي"
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div className="vn-waveform">
        {/* Background bars */}
        <div className="vn-wave-bg">
          {[
            20, 35, 50, 28, 45, 70, 40, 60, 32, 75,
            50, 38, 65, 25, 48, 70, 42, 55, 30, 45,
            68, 40, 60, 35, 50, 72, 45, 30, 58, 40
          ].map((height, i) => (
            <span
              key={i}
              className="vn-bar"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Played overlay */}
        <div
          className="vn-wave-played"
          style={{ width: `${progressPercent}%` }}
        >
          {[
            20, 35, 50, 28, 45, 70, 40, 60, 32, 75,
            50, 38, 65, 25, 48, 70, 42, 55, 30, 45,
            68, 40, 60, 35, 50, 72, 45, 30, 58, 40
          ].map((height, i) => (
            <span
              key={i}
              className="vn-bar played"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <span className="vn-time">{formatTime(currentTime)}</span>

      <audio
        ref={audioRef}
        className="vn-audio"
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
