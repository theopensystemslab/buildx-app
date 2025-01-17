import Modal from "@/app/ui/Modal";
import Sidebar from "@/app/ui/Sidebar";
import { deleteProject } from "@opensystemslab/buildx-core";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  open: boolean;
  close: () => void;
};

const DeleteProjectMenu = ({ open, close }: Props) => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const reallyDelete = () => {
    deleteProject();
    setModalOpen(false);
    close();
    router.push("/locate");
  };

  return (
    <Sidebar expanded={open} onClose={close}>
      <div className="p-4">
        <button onClick={() => setModalOpen(true)}>Delete Project</button>
      </div>
      {modalOpen ? (
        <Modal onClose={() => setModalOpen(false)} title="Delete Project?">
          <p>You will not be able to undo this</p>

          <div className="flex items-center justify-end space-x-4">
            <button onClick={() => setModalOpen(false)}>Cancel</button>
            <button
              className="bg-grey-80 px-4 py-1 text-white hover:bg-black"
              onClick={reallyDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      ) : null}
    </Sidebar>
  );
};

export default DeleteProjectMenu;
