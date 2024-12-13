"use client";
import { useState } from "react";
import LabourTable from "./LabourTable";
import { Download } from "@carbon/icons-react";

const LabourApp = () => {
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between px-3 py-5">
        <div>
          <h1>Labour</h1>
          <p className="max-w-3xl mt-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illum
            vel sapiente placeat obcaecati laudantium officia tenetur eum, quod,
            animi rem accusantium culpa doloribus voluptatum autem at recusandae
            molestias deleniti.
          </p>
        </div>
        <div>
          {csvDownloadUrl !== null && (
            <a
              href={csvDownloadUrl}
              download={`materials-list.csv`}
              className="flex font-semibold items-center"
            >
              <span>Download CSV</span>
              <span className="ml-2">
                <Download size={"20"} />
              </span>
            </a>
          )}
        </div>
      </div>
      <LabourTable setCsvDownloadUrl={setCsvDownloadUrl} />
    </div>
  );
};

export default LabourApp;
