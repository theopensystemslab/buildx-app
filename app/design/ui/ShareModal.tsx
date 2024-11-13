import Modal from "@/app/ui/Modal";
import { Link } from "@/app/ui/icons";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ShareModal = ({ open, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!open) return null;

  return (
    <Modal onClose={onClose} title="Save or share a copy">
      <div className="space-y-4">
        <p className="text-sm">Use this link to</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Save a copy of your project as it looks now</li>
          <li>Share a copy of your project with someone else</li>
        </ul>

        <div className="flex items-center rounded border border-grey-20">
          <div className="flex-1 flex items-center bg-grey-10 px-2 py-1">
            <Link />
            <div className="truncate text-sm ml-2">{window.location.href}</div>
          </div>
          <button
            onClick={copyLink}
            className={`px-4 py-1 text-sm ${
              copied
                ? "bg-grey-20 text-grey-50"
                : "bg-black text-white hover:bg-grey-80"
            }`}
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-center py-3 mt-4 hover:bg-grey-10"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};

export default ShareModal;
