import React from "react";
import Spinner from "./spinner";

function Loader() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-background">
            <div className="flex flex-col items-center space-y-4">
                <Spinner />
                <p className="text-lg font-medium text-muted-foreground">Loading...</p>
                <p className="text-gray-600 mt-2">Checking authentication status</p>
            </div>
        </div>
    );
}

export default Loader;