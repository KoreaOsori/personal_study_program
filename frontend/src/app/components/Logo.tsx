export function Logo({ className = "", size = "default", showSubtitle = false }: { className?: string; size?: "small" | "default" | "large"; showSubtitle?: boolean }) {
  const sizes = {
    small: { container: "h-8", text: "text-lg", icon: "w-6 h-6", subtitle: "text-[10px]" },
    default: { container: "h-10", text: "text-xl", icon: "w-8 h-8", subtitle: "text-xs" },
    large: { container: "h-14", text: "text-3xl", icon: "w-12 h-12", subtitle: "text-sm" },
  };

  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${sizeClasses.container} ${className}`}>
      <div className={`${sizeClasses.icon} rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5">
          {/* Dream star icon */}
          <path
            d="M12 2L14.5 9L22 9.5L16.5 14.5L18.5 21.5L12 17L5.5 21.5L7.5 14.5L2 9.5L9.5 9L12 2Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Heart in the center */}
          <path
            d="M12 15.5C12 15.5 8.5 13 8.5 10.5C8.5 9.5 9.2 8.5 10.5 8.5C11.3 8.5 11.8 9 12 9.5C12.2 9 12.7 8.5 13.5 8.5C14.8 8.5 15.5 9.5 15.5 10.5C15.5 13 12 15.5 12 15.5Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight`}>
          자꿈이
        </span>
        {showSubtitle && (
          <span className={`${sizeClasses.subtitle} text-muted-foreground leading-tight`}>
            자기의 꿈을 이루자!
          </span>
        )}
      </div>
    </div>
  );
}
