import { useEffect, useState } from "react";
import SpeciesTable from "./SpeciesTable";
import useSpecies from "../../../../hooks/useSpecies";
import useStore from "../../../../hooks/useStore";
import CreateSpeciesModal from "./CreateSpeciesModal";
import { showNotification } from "../../../Common/Notification";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import { FaTrash, FaSeedling } from "react-icons/fa";

function SpeciesComponent() {
  const { species, getSpecies, deleteSpecies } = useSpecies();
  const { user } = useStore();
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({});
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  useEffect(() => {
    getSpecies();
  }, []);

  function handleEdit(sp) {
    setSelected(sp);
    setOpenModal(true);
  }

  function handleDelete(sp) {
    if (!user || user.role !== "ADMIN") return;
    setSelectedForDelete(sp);
    setConfirmationContent({
      title: "Delete Species",
      message: `Delete confirmation for: ${sp.scientificName}`,
      type: "warning",
      icon: FaTrash,
      iconColor: "text-red-600",
      onConfirm: () => handleDeleteSubmit(sp),
    });
    setOpenConfirmation(true);
  }

  function handleDeleteSubmit(sp) {
    deleteSpecies(sp.id)
      .then(() => {
        showNotification({
          type: "success",
          title: "Species deleted",
          message: sp.scientificName,
        });
        setOpenConfirmation(false);
        setSelectedForDelete(null);
      })
      .catch(() => {
        showNotification({ type: "error", title: "Deletion failed" });
        setOpenConfirmation(false);
        setSelectedForDelete(null);
      });
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg mt-4">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 p-2 mx-4">
        <h1 className="text-xl font-semibold flex gap-2 items-center text-green-600">
          <FaSeedling className="mr-2" /> Species
        </h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenModal(true);
          }}
          className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-semibold"
        >
          Create Species
        </button>
      </div>

      <SpeciesTable
        species={species}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateSpeciesModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        onCreated={() => {
          setOpenModal(false);
          setSelected(null);
          getSpecies();
        }}
        speciesItem={selected}
      />

      <ConfirmationModal
        isOpen={openConfirmation}
        closeModal={() => {
          setOpenConfirmation(false);
          setSelectedForDelete(null);
          setConfirmationContent({});
        }}
        title={confirmationContent.title}
        message={confirmationContent.message}
        icon={confirmationContent.icon}
        iconColor={confirmationContent.iconColor}
        onConfirm={() => confirmationContent.onConfirm?.()}
      />
    </div>
  );
}

export default SpeciesComponent;
