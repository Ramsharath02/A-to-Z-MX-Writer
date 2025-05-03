import React from 'react';

interface BackgroundProps {
  darkMode: boolean;
  getGradientClasses: () => string;
}

const Background: React.FC<BackgroundProps> = ({ darkMode, getGradientClasses }) => {
  if (!darkMode) return null;
  
  return (
    <div className="absolute hidden inset-0 overflow-hidden">
      {/* Main gradient */}
      <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-gradient-radial from-[#1a2a3a]/20 via-transparent to-transparent opacity-70"></div>
      
      {/* Top-right light source */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-radial from-[#2a4a6a]/20 via-transparent to-transparent opacity-40"></div>
      
      {/* Bottom-left light source */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-radial from-[#1a3a5a]/20 via-transparent to-transparent opacity-30"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjMgMCAxMiA1LjM3IDEyIDEyaC02YzAgNi42MyA1LjM3IDEyIDEyIDEydjZjOS45NCAwIDE4LTguMDYgMTgtMThoLTZjMCA2LjYzLTUuMzcgMTItMTIgMTJ2LTZjLTYuNjMgMC0xMi01LjM3LTEyLTEyaDZ6IiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9Ii4wNCIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${getGradientClasses()} opacity-20 animate-pulse`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Background;