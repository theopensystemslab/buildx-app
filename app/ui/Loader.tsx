import { useEffect, useState } from "react";

const Loader = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000); // Show message after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      {showMessage && (
        <p className="mt-4 text-sm text-gray-600 max-w-md text-center">
          This is taking longer than usual. If loading persists, try refreshing
          the page.
        </p>
      )}
    </div>
  );
};

export default Loader;
