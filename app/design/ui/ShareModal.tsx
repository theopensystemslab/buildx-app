import Modal from "@/app/ui/Modal";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ShareModal = ({ open, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      // You'll need to implement or import a function to get the share URL
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
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

        <div className="flex items-center space-x-2 bg-grey-10 p-2 rounded">
          <div className="flex-1 truncate text-sm">{window.location.href}</div>
          <button
            onClick={copyLink}
            className="px-4 py-1 text-sm bg-black text-white hover:bg-grey-80"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm bg-grey-10 hover:bg-grey-20"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
