import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";
import ClassificationBadge from "../../../Common/Classifications/ClassificationBadge";
import useSpecies from "../../../../hooks/useSpecies";
import { useEffect, useState } from "react";
import { Switch } from "react-aria-components";

function EditClassificationModal({ isOpen, closeModal, selectedUpload }) {
  const { species, loading, error, getSpecies, shapes } = useSpecies();
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [isHealthy, setIsHealthy] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      getSpecies();
    }
  }, [isOpen]);

  return (
    <>
      {" "}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center border-b pb-4 border-gray-200">
                    <Dialog.Title
                      as="h3"
                      className=" flex gap-2 text-lg font-medium leading-6 text-green-700"
                    >
                      <FaEdit /> Edit Classification
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  {selectedUpload && (
                    <div className="space-y-6 pt-8">
                      <img
                        src={selectedUpload.imagePath}
                        alt={selectedUpload.originalFilename}
                        className="max-w-[300px] rounded-2xl m-auto w-full"
                      />
                      <div className="flex gap-4 mt-8 flex-col border-b pb-8 border-gray-200">
                        <div className=" flex flex-col">
                          <label className="text-sm font-medium text-gray-700">
                            Current Species
                          </label>
                          <ClassificationBadge
                            classification={selectedUpload.species}
                            confidence={selectedUpload.speciesConfidence}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700">
                            Current Shape
                          </label>
                          <ClassificationBadge
                            classification={selectedUpload.shape}
                            confidence={selectedUpload.shapeConfidence}
                          />
                        </div>
                      </div>
                      <h1 className="text-lg font-medium text-green-700">
                        Change Tags
                      </h1>
                      <div className="flex flex-col">
                        <label
                          htmlFor="species"
                          className="text-sm font-medium text-gray-700"
                        >
                          Species
                        </label>
                        <select
                          id="species"
                          name="species"
                          value={selectedSpecies}
                          onChange={(e) => setSelectedSpecies(e.target.value)}
                          className="mt-2 block w-full rounded-md border-gray-400 border-2 focus:ring-green-500 focus:ring-2 p-1"
                        >
                          <option value="">Select a species</option>
                          {species.length > 0 &&
                            species.map((species) => (
                              <option key={species.id} value={species.id}>
                                {species.scientificName} -{" "}
                                {species.commonNameEn}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="shape"
                          className="text-sm font-medium text-gray-700"
                        >
                          Shape
                        </label>
                        <select
                          id="shape"
                          name="shape"
                          value={selectedShape}
                          onChange={(e) => setSelectedShape(e.target.value)}
                          className="mt-2 block w-full rounded-md border-gray-400 border-2 focus:ring-green-500 focus:ring-2 p-1"
                        >
                          <option value="">Select a shape</option>
                          {shapes.length > 0 &&
                            shapes.map((shape, index) => (
                              <option key={index} value={shape.id}>
                                {shape.nameEn}
                              </option>
                            ))}
                        </select>
                      </div>
                      <Switch
                        isSelected={isHealthy}
                        onChange={setIsHealthy}
                        className={({
                          isSelected,
                          isFocusVisible,
                          isDisabled,
                        }) => `
                          inline-flex items-center gap-3 select-none
                          ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        `}
                      >
                        {({ isSelected }) => (
                          <>
                            <div
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200
                                ${isSelected ? "bg-green-600" : "bg-gray-300"}
                              `}
                            >
                              <div
                                className={`h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform duration-200
                                  ${
                                    isSelected
                                      ? "translate-x-6"
                                      : "translate-x-0"
                                  }
                                `}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium
                                ${
                                  isSelected ? "text-green-700" : "text-red-700"
                                }
                              `}
                            >
                              {isSelected ? "Healthy" : "Diseased"}
                            </span>
                          </>
                        )}
                      </Switch>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
export default EditClassificationModal;
