import React from "react";

function Loader() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-background">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                <p className="text-lg font-medium text-muted-foreground">Loading...</p>
                <p className="text-gray-600 mt-2">Checking authentication status</p>
            </div>
        </div>
    );
}

export default Loader;