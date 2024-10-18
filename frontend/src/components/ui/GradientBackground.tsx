export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-black to-gray-300 flex items-center justify-center">
        <div className="h-full bg-black opacity-80 absolute inset-0"></div> {/* Dark overlay for depth */}
        <div className="relative z-10">{children}</div> {/* Render children here */}
      </div>
    );
  };
  