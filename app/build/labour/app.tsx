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
            An outline of how long it might take to assemble and install the
            building on site. These are very rough estimates only. Actual time
            will vary depending on the team, local labour costs and site
            conditions. Does not include wider project planning and site
            preparation.
          </p>
        </div>
        <div>
          {csvDownloadUrl !== null && (
            <a
              href={csvDownloadUrl}
              download={`labour.csv`}
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
