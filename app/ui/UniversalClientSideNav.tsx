"use client";
import { useProjectData } from "@opensystemslab/buildx-core";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import usePortal from "react-cool-portal";
import DeleteProjectMenu from "../design/ui/DeleteProjectMenu";
import ShareModal from "../design/ui/ShareModal";
import useSharingWorker from "../utils/workers/sharing/useSharingWorker";
import IconButton from "./IconButton";
import { Menu, Share } from "./icons";

const UniversalClientSideNav = () => {
  useSharingWorker();

  const { Portal: HeaderEndPortal } = usePortal({
    containerId: "headerEnd",
    autoRemoveContainer: false,
    internalShowHide: false,
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteProjectMenuOpen, setDeleteProjectMenuOpen] = useState(false);

  const { lastSaved = null } = useProjectData();

  return (
    <>
      <HeaderEndPortal>
        <div className="flex items-center justify-end">
          <div className="text-xs text-gray-600 mr-8 lg:mr-32">
            {lastSaved ? (
              <>
                Last saved:{" "}
                <time dateTime={new Date(lastSaved).toISOString()}>
                  {formatDistanceToNow(new Date(lastSaved), {
                    addSuffix: true,
                  })}
                </time>
              </>
            ) : (
              "Not saved yet"
            )}
          </div>
          <IconButton
            onClick={() => setShareModalOpen(true)}
            aria-label="Share project"
          >
            <Share />
          </IconButton>
          <IconButton onClick={() => setDeleteProjectMenuOpen(true)}>
            <Menu />
          </IconButton>
        </div>
      </HeaderEndPortal>

      <DeleteProjectMenu
        open={deleteProjectMenuOpen}
        close={() => setDeleteProjectMenuOpen(false)}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
};

export default UniversalClientSideNav;
