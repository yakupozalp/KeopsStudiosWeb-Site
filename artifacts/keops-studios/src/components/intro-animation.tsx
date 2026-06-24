import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTRO_KEY = "keops-intro-shown";

export function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(INTRO_KEY);
    if (!alreadyShown) {
      setShow(true);
      sessionStorage.setItem(INTRO_KEY, "1");
    }
  }, []);

  const handleEnd = () => {
    setFadeOut(true);
    setTimeout(() => setShow(false), 800);
  };

  useEffect(() => {
    if (show && videoRef.current) {
      videoRef.current.play().catch(() => handleEnd());
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      >
        <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src="/intro.mp4"
            muted
            playsInline
            onEnded={handleEnd}
            onError={handleEnd}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
