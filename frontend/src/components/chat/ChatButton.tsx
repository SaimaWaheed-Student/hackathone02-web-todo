'use client';

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

export function ChatButton({ onClick, className }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group fixed bottom-5 right-5 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center z-[1000] transition-all duration-200 hover:scale-105 active:scale-95 ${className || ''}`}
      aria-label="Open chat assistant"
    >
      {/* Chat icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
        />
      </svg>

      {/* Notification dot */}
      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
    </button>
  );
}
