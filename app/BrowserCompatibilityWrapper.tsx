"use client";

import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import { PropsWithChildren, useEffect, useState } from "react";

const BrowserWarning = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <h1 className="text-2xl font-bold mb-4">Browser Compatibility Notice</h1>
    <p className="max-w-md mb-4">
      This application requires a Chromium-based browser (Chrome, Edge, Brave,
      etc.) for optimal performance and compatibility.
    </p>
    <p className="text-sm text-gray-600">
      Please switch to a supported browser to continue.
    </p>
  </div>
);

const BrowserCompatibilityWrapper = ({ children }: PropsWithChildren) => {
  const [isCompatible, setIsCompatible] = useState(true);
  const userAgent = useUserAgent();

  useEffect(() => {
    const isChromiumBased = Boolean(
      userAgent?.browser?.name &&
        ["Chrome", "Chromium", "Edge", "Opera"].includes(
          String(userAgent.browser.name)
        )
    );
    setIsCompatible(isChromiumBased);
  }, [userAgent]);

  if (!isCompatible) {
    return <BrowserWarning />;
  }

  return <>{children}</>;
};

export default BrowserCompatibilityWrapper;
