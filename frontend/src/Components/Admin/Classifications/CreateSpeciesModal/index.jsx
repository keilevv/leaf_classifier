import { useState, useMemo } from "react";
import Modal from "../../../Common/Modal";
import useSpecies from "../../../../hooks/useSpecies";
import { FaSeedling } from "react-icons/fa";

function slugify(input = "") {
  return String(input)
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, "")
    .replace(/[\s._]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$|\.$/g, "");
}

function CreateSpeciesModal({ isOpen, closeModal, onCreated }) {
  const { createSpecies } = useSpecies();
  const [scientificName, setScientificName] = useState("");
  const [commonNameEn, setCommonNameEn] = useState("");
  const [commonNameEs, setCommonNameEs] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slug = useMemo(() => slugify(scientificName), [scientificName]);

  const canSubmit =
    scientificName.trim() && commonNameEn.trim() && commonNameEs.trim();

  async function handleConfirm() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");
    try {
      await createSpecies({ scientificName, commonNameEn, commonNameEs });
      setLoading(false);
      setScientificName("");
      setCommonNameEn("");
      setCommonNameEs("");
      closeModal();
      onCreated && onCreated();
    } catch (e) {
      setLoading(false);
      setError(e?.response?.data?.error || "Failed to create species");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      onConfirm={handleConfirm}
      title="Create Species"
      icon={FaSeedling}
      iconColor="text-green-600"
      confirmText={loading ? "Creating..." : "Create"}
    >
      <div className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Scientific name
          </label>
          <input
            type="text"
            value={scientificName}
            onChange={(e) => setScientificName(e.target.value)}
            placeholder="e.g. Zea Mays"
            className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-gray-500 mt-1">Slug: {slug || "—"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Common name (English)
            </label>
            <input
              type="text"
              value={commonNameEn}
              onChange={(e) => setCommonNameEn(e.target.value)}
              placeholder="e.g. Corn"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Nombre común (Español)
            </label>
            <input
              type="text"
              value={commonNameEs}
              onChange={(e) => setCommonNameEs(e.target.value)}
              placeholder="p. ej., Maíz"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
        {!canSubmit && (
          <p className="text-xs text-gray-500">
            Please fill all fields to enable creation.
          </p>
        )}
      </div>
    </Modal>
  );
}
export default CreateSpeciesModal;
