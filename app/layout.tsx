import clsx from "clsx";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import "~/styles/globals.css";
import Footer from "./ui/Footer";
import Nav from "./ui/Nav";
import Fathom from "./utils/Fathom";
import { Metadata } from "next";
import { getTakedownStatus } from "./utils/takedown"; // You'll need to create this

const inter = Inter({
  subsets: ["latin"],
  // display: "swap",
});

const Layout = async ({ children }: PropsWithChildren<{}>) => {
  const isTakedownEnabled = await getTakedownStatus();

  return (
    <html lang="en" className={clsx(inter.className, "w-full h-full")}>
      <body className="w-full h-full flex flex-col overflow-hidden">
        <Fathom />
        {isTakedownEnabled ? (
          <div className="takedown-message flex-auto flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Takedown</h1>
              <p>This site is currently unavailable.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 flex-grow-0">
              <Nav />
            </div>
            <div className="flex-auto overflow-y-auto overflow-x-hidden">
              {children}
            </div>
            <div className="flex-1 flex-grow-0">
              <Footer />
            </div>
          </>
        )}
      </body>
    </html>
  );
};

export const metadata: Metadata = {
  title: "Design your WikiHouse",
  description:
    "Explore the prototype WikiHouse design tool, and share your suggestions or ideas for how we can improve it using the ‘feedback’ link. You can find the password at community.wikihouse.cc",
  metadataBase: new URL("https://build.wikihouse.cc"),
};

export default Layout;
