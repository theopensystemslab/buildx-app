import clsx from "clsx";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Fragment, PropsWithChildren } from "react";
import "~/styles/globals.css";
import GlobalClientSideEffects from "./GlobalClientSideEffects";
import Footer from "./ui/Footer";
import Nav from "./ui/Nav";
import Fathom from "./utils/Fathom";
import config from "@/buildx-app.config.json";
import dynamic from "next/dynamic";

const inter = Inter({
  subsets: ["latin"],
});

// Dynamic import with no SSR
const BrowserCompatibilityWrapper = dynamic(
  () => import("./BrowserCompatibilityWrapper"),
  { ssr: false }
);

const TakedownMessage = () => {
  return (
    <div className="takedown-message flex-auto flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Sorry, this page is currently unavailable.
        </h1>
        <p>We are working on it. Please check back soon.</p>
      </div>
    </div>
  );
};

const Layout = async ({ children }: PropsWithChildren<{}>) => {
  const isTakedownEnabled = config.takedown === "true";

  return (
    <Fragment>
      <GlobalClientSideEffects />
      <html lang="en" className={clsx(inter.className, "w-full h-full")}>
        <body className="w-full h-full flex flex-col overflow-hidden">
          <Fathom />
          {isTakedownEnabled ? (
            <TakedownMessage />
          ) : (
            <BrowserCompatibilityWrapper>
              <div className="flex-1 flex-grow-0">
                <Nav />
              </div>
              <div className="flex-auto overflow-y-auto overflow-x-hidden">
                {children}
              </div>
              <div className="flex-1 flex-grow-0">
                <Footer />
              </div>
            </BrowserCompatibilityWrapper>
          )}
        </body>
      </html>
    </Fragment>
  );
};

export const metadata: Metadata = {
  title: "Design your WikiHouse",
  description:
    "Explore the prototype WikiHouse design tool, and share your suggestions or ideas for how we can improve it using the 'feedback' link.",
  metadataBase: new URL("https://build.wikihouse.cc"),
  openGraph: {
    images: [
      {
        url: "/BuildWikiHouse_OpenGraph.png",
        width: 1200,
        height: 630,
        alt: "WikiHouse Design Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/BuildWikiHouse_OpenGraph.png",
        width: 1200,
        height: 630,
        alt: "WikiHouse Design Tool",
      },
    ],
  },
};

export default Layout;
