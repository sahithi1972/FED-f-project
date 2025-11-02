import { useEffect } from "react";

export function useProfileCue(ref: React.RefObject<HTMLElement>, trigger: boolean) {
  useEffect(() => {
    if (!ref.current || !trigger) return;
    ref.current.classList.add("profile-cue-animate");
    return () => {
      ref.current?.classList.remove("profile-cue-animate");
    };
  }, [ref, trigger]);
}

// Add this CSS to your global styles or Tailwind config:
// .profile-cue-animate {
//   position: relative;
// }
// .profile-cue-animate::after {
//   content: "";
//   position: absolute;
//   top: -30px;
//   left: 50%;
//   transform: translateX(-50%);
//   width: 40px;
//   height: 40px;
//   background: url('/images/hand-pointer.png') no-repeat center/contain;
//   animation: bounce-hand 1.2s infinite;
//   pointer-events: none;
//   z-index: 20;
// }
// @keyframes bounce-hand {
//   0%, 100% { transform: translateX(-50%) translateY(0); }
//   50% { transform: translateX(-50%) translateY(-10px); }
// }
