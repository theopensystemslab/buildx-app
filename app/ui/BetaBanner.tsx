import { Close } from "@carbon/icons-react";
import { useState, useEffect } from "react";

const BetaBanner = () => {
  const [open, setOpen] = useState(true);

  const fireResize = () => {
    window.dispatchEvent(new Event("resize"));
  };

  useEffect(() => {
    fireResize();
    return fireResize;
  }, [open]);

  return open ? (
    <div className="flex justify-between pt-2 px-4 text-lg w-full bg-safety">
      <div>
        <span className="font-bold">BETA</span>
        <span className="ml-2">This is a prototype.</span>
        <span>
          {` You can help us improve by giving `}
          <a
            className="underline"
            href="https://form.typeform.com/to/inbsKUl2"
            target="_blank"
            rel="noopener noreferrer"
          >
            feedback and suggestions.
          </a>
        </span>
      </div>
      <div>
        <span>
          <button onClick={() => void setOpen(false)}>
            <Close size={"32"} />
          </button>
        </span>
      </div>
    </div>
  ) : null;
};

export default BetaBanner;
