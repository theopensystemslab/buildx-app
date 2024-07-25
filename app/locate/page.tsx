import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

const LocatePage = () => {
  return <App />;
};

export default LocatePage;
