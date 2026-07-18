import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, CheckCircle, Star, Headphones, MessageSquareQuote } from "lucide-react";
import { AudioReview } from "./types";

interface AudioReviewsProps {
  proofs?: Array<{ url?: string; caption?: string }>;
}

export default function AudioReviews({ proofs }: AudioReviewsProps) {
  // Convert custom proofs if available, otherwise use defaults
  const audioReviews: AudioReview[] = (proofs && proofs.length > 0)
    ? proofs.map((p, index) => {
        const parts = p.caption ? p.caption.split('-') : [];
        const name = parts[0]?.trim() || `زبون موثق ${index + 1}`;
        const city = parts[1]?.trim() || "الجزائر";
        return {
          id: index + 100, // offset IDs to avoid conflict with mock ones
          name,
          avatar: `https://placehold.co/100x100/FAF8F5/C9A227?text=${encodeURIComponent(name[0] || 'ز')}`,
          city,
          duration: "0:30",
          rating: 5,
          transcript: p.caption || "رأي صوتي مسجل من أحد عملائنا الكرام بعد استلام المنتج ومعاينته.",
          date: "شراء مؤكد",
          url: p.url
        };
      })
    : [
        {
          id: 1,
          name: "المهندس فيصل الحربي",
          avatar: "https://placehold.co/100x100/FAF8F5/C9A227?text=فيصل",
          city: "الرياض، المملكة العربية السعودية",
          duration: "0:24",
          rating: 5,
          transcript: "صراحة فاق كل توقعاتي! جودة التصميم من التيتانيوم خرافية، أحس إني لابس قطعة مجوهرات فاخرة مو بس خاتم ذكي. دقة قياس النوم وضربات القلب ممتازة وتطبيق الجوال سريع ويدعم العربي بالكامل. أنصح فيه بقوة!",
          date: "قبل يومين"
        },
        {
          id: 2,
          name: "الدكتورة أمل العتيبي",
          avatar: "https://placehold.co/100x100/FAF8F5/C9A227?text=أمل",
          city: "جدة، المملكة العربية السعودية",
          duration: "0:31",
          rating: 5,
          transcript: "تتبعت فيه نومي ومعدل الأكسجين والحرارة، ومقارنة بالأجهزة الطبية القراءة دقيقة جداً. البطارية استمرت معي 7 أيام ونصف بشحنة واحدة فقط! مريح جداً في الإصبع أثناء النوم والوضوء.",
          date: "قبل 5 أيام"
        },
        {
          id: 3,
          name: "أبو حمد السويدي",
          avatar: "https://placehold.co/100x100/FAF8F5/C9A227?text=أبو+حمد",
          city: "دبي، الإمارات العربية المتحدة",
          duration: "0:19",
          rating: 5,
          transcript: "المنتج يستحق كل ريال. التغليف فخم وراقي وخدمة العملاء على الواتساب قمة في الذوق والسرعة ساعدوني باختيار المقاس الصحيح. ميزة الدفع عند الاستلام تعطي طمأنينة كبيرة للعميل.",
          date: "قبل أسبوع"
        }
      ];

  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<{ [key: number]: number }>({});

  const synthRef = useRef<any>(null);
  const audioObjRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervals = useRef<{ [key: number]: any }>({});

  const stopActiveSynth = () => {
    if (synthRef.current) {
      try {
        synthRef.current.stop();
      } catch (e) {
        console.log(e);
      }
      synthRef.current = null;
    }
  };

  const playSynthesizer = (id: number) => {
    stopActiveSynth();

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      const baseFreq = id === 1 ? 220 : id === 2 ? 261.63 : 196;
      playTone(baseFreq, ctx.currentTime, 1.2);
      playTone(baseFreq * 1.2, ctx.currentTime + 0.3, 1.2);
      playTone(baseFreq * 1.5, ctx.currentTime + 0.6, 1.5);
      playTone(baseFreq * 1.8, ctx.currentTime + 0.9, 1.8);

      synthRef.current = {
        stop: () => {
          ctx.close();
        }
      };
    } catch (err) {
      console.warn("Synthesis blocked or unsupported", err);
    }
  };

  const handlePlayPause = (review: AudioReview) => {
    const id = review.id;
    
    // If we click the currently playing audio, pause it
    if (activeReviewId === id) {
      if (audioObjRef.current) {
        audioObjRef.current.pause();
      } else {
        stopActiveSynth();
        clearInterval(progressIntervals.current[id]);
      }
      setActiveReviewId(null);
      return;
    }

    // Stop whatever else might be playing
    if (audioObjRef.current) {
      audioObjRef.current.pause();
      audioObjRef.current = null;
    }
    stopActiveSynth();
    if (activeReviewId !== null && progressIntervals.current[activeReviewId]) {
      clearInterval(progressIntervals.current[activeReviewId]);
    }

    // Play new audio
    if (review.url) {
      // Real Audio URL
      const audio = new Audio(review.url);
      audioObjRef.current = audio;

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          const pct = (audio.currentTime / audio.duration) * 100;
          setPlaybackProgress(prev => ({ ...prev, [id]: pct }));
        }
      });

      audio.addEventListener('ended', () => {
        setActiveReviewId(null);
        setPlaybackProgress(prev => ({ ...prev, [id]: 0 }));
        audioObjRef.current = null;
      });

      audio.play().then(() => {
        setActiveReviewId(id);
      }).catch(err => {
        console.error("Audio playback failed", err);
      });
    } else {
      // Synth Fallback
      setActiveReviewId(id);
      playSynthesizer(id);

      const durationSecs = id === 1 ? 24 : id === 2 ? 31 : 19;
      const intervalMs = 100;
      const step = (intervalMs / (durationSecs * 1000)) * 100;

      progressIntervals.current[id] = setInterval(() => {
        setPlaybackProgress(prev => {
          const current = prev[id] || 0;
          if (current >= 100) {
            clearInterval(progressIntervals.current[id]);
            setActiveReviewId(null);
            stopActiveSynth();
            return { ...prev, [id]: 0 };
          }
          return { ...prev, [id]: Math.min(current + step, 100) };
        });
      }, intervalMs);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopActiveSynth();
      if (audioObjRef.current) {
        audioObjRef.current.pause();
      }
      Object.values(progressIntervals.current).forEach(clearInterval);
    };
  }, []);

  const generateWaveform = (reviewId: number, count: number) => {
    const isPlaying = activeReviewId === reviewId;
    return Array.from({ length: count }).map((_, index) => {
      const seed = Math.sin(index * 0.4) * 0.4 + 0.6;
      const baseHeight = Math.floor(seed * 24) + 4;

      const currentProgress = playbackProgress[reviewId] || 0;
      const playedPercentage = (index / count) * 100;
      const isPlayed = currentProgress >= playedPercentage;

      return (
        <span
          key={index}
          className={`w-0.5 rounded-full transition-all duration-300 ${
            isPlayed ? "bg-[#C9A227]" : "bg-gray-200"
          } ${isPlaying && isPlayed ? "animate-pulse" : ""}`}
          style={{
            height: isPlaying ? `${Math.max(4, baseHeight + Math.sin((Date.now() / 150) + index) * 8)}px` : `${baseHeight}px`
          }}
        />
      );
    });
  };

  return (
    <section className="py-12 bg-white rounded-[2.5rem] border border-[#EAE6E1] p-6 md:p-10 space-y-8 shadow-sm">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] text-[#C9A227] px-4 py-1.5 rounded-full text-xs font-bold border border-[#EAE6E1]">
          <Headphones className="w-3.5 h-3.5" />
          تجارب صوتية مسجلة
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">أصوات عملائنا الموثقة</h2>
        <div className="w-12 h-0.5 bg-[#C9A227] mx-auto rounded-full"></div>
        <p className="text-xs md:text-sm text-gray-500">
          استمع لآراء عملائنا الحقيقية وتجاربهم مع المنتج وطبيعة استخدامه اليومي.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-4">
        {audioReviews.map(review => {
          const isPlaying = activeReviewId === review.id;
          const progress = playbackProgress[review.id] || 0;

          return (
            <div
              key={review.id}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                isPlaying
                  ? "bg-[#FAF8F5] border-[#C9A227] ring-1 ring-[#C9A227]/20 shadow-md"
                  : "bg-white border-[#EAE6E1] hover:border-gray-300 shadow-sm"
              }`}
              id={`audio_review_card_${review.id}`}
            >
              {/* Header profile */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full border border-[#EAE6E1] object-cover animate-fadeIn"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-right">
                    <h4 className="text-xs md:text-sm font-bold text-[#1A1A1A]">{review.name}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{review.city}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5 fill-emerald-100" />
                    شراء موثق
                  </span>
                </div>
              </div>

              {/* Custom Voice Message Player UI */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE6E1] space-y-3">
                <div className="flex items-center gap-3 justify-between">
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayPause(review)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      isPlaying
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-[#C9A227] text-white hover:scale-105"
                    }`}
                    id={`play_btn_rev_${review.id}`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current mr-[-2px]" />}
                  </button>

                  {/* Animated Waveform Display */}
                  <div className="flex-1 flex items-end justify-center gap-[3px] h-8 px-2 overflow-hidden select-none">
                    {generateWaveform(review.id, 24)}
                  </div>

                  {/* Duration label */}
                  <div className="text-[10px] font-mono text-gray-400 select-none">
                    {isPlaying
                      ? `0:${Math.floor((progress / 100) * (review.url ? 30 : (review.id === 1 ? 24 : review.id === 2 ? 31 : 19))).toString().padStart(2, "0")}`
                      : review.duration}
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C9A227] h-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Transcript */}
              <div className="text-right space-y-2 bg-[#FAF8F5]/40 p-4 rounded-xl border border-dashed border-[#EAE6E1] flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>تفريغ الرسالة الصوتية:</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{review.transcript}"
                </p>
              </div>

              {/* Footer details */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-3">
                <span>{review.date}</span>
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-[#C9A227]" />
                  اضغط للاستماع للتجربة
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
