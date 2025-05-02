import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--background))]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-[hsl(var(--foreground))]">Cargando...</p>
        </div>
    );
};

export default Loading;
