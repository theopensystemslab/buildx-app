"use client";
import useSharingWorker from "../utils/workers/old/useSharingWorker";

const FooPage = () => {
  useSharingWorker();

  return <div>FooPage</div>;
};

export default FooPage;
