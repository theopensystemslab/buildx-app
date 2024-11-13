"use client";
import Modal from "@/app/ui/Modal";
import { Link } from "@/app/ui/icons";
import { Close } from "@carbon/icons-react";
import { useProjectData } from "@opensystemslab/buildx-core";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ShareModal = ({ open, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  const { shareUrlPayload } = useProjectData();

  const shareUrl =
    shareUrlPayload === null
      ? window.location.origin
      : `${window.location.origin}/?q=${shareUrlPayload}`;

  const copyLink = async () => {
    try {
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
      <div className="relative space-y-4">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 -mt-8 -mr-2"
        >
          <Close size={24} />
        </button>

        <p className="text-sm w-[30rem]">Use this link to</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Save a copy of your project as it looks now</li>
          <li>Share a copy of your project with someone else</li>
        </ul>

        <div className="bg-grey-10">
          <div className="flex items-stretch">
            <div className="truncate flex-1 flex items-center px-4 py-2">
              <span>
                <Link />
              </span>
              <div className="truncate text-sm ml-4">{shareUrl}</div>
            </div>
            <button
              onClick={copyLink}
              className={`text-sm ${
                copied ? "text-grey-50" : "bg-black text-white hover:bg-grey-80"
              } px-4`}
            >
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="bg-grey-10">
          <button onClick={onClose} className="w-full text-center py-3">
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
