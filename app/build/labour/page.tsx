import dynamic from "next/dynamic";

const LabourApp = dynamic(() => import("./app"), { ssr: false });

const LabourPage = () => {
  return <LabourApp />;
};

export default LabourPage;
