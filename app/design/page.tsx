import { Suspense } from "react";
import Loader from "../ui/Loader";
import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

const IndexPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  );
};

export default IndexPage;
