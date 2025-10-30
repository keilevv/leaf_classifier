import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import ClassificationBadge from "../../../Common/Classifications/ClassificationBadge";
import { getStatusBadge } from "../../../../utils";
import useSpecies from "../../../../hooks/useSpecies";
import useAdmin from "../../../../hooks/useAdmin";
import useStore from "../../../../hooks/useStore";
import { showNotification } from "../../../Common/Notification";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Switch } from "react-aria-components";
import { cn } from "../../../../utils";

const shapeModules = import.meta.glob("/src/assets/images/shapes/*.webp", {
  eager: true,
  as: "url",
});
const shapeUrlByKey = Object.fromEntries(
  Object.entries(shapeModules).map(([path, url]) => {
    const filename = path.split("/").pop() || "";
    const key = filename.replace(".webp", "");
    return [key, url];
  })
);

function EditClassificationForm() {
  const { species, loading: loadingSpecies, getSpecies, shapes } = useSpecies();
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isHealthy, setIsHealthy] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [shapeQuery, setShapeQuery] = useState("");
  const [shapeSrc, setShapeSrc] = useState(shapeUrlByKey["lanceolate"] || "");
  const { updateClassification, getClassification, classification, loading } =
    useAdmin();
  const { id } = useParams();
  const { user } = useStore();

  useEffect(() => {
    if (id) {
      getClassification(id);
      getSpecies();
    }
  }, [id]);

  useEffect(() => {
    if (classification) {
      setIsHealthy(classification.isHealthy);
      setSelectedSpecies(classification.taggedSpecies);
      setSelectedShape(classification.taggedShape);
      setSelectedStatus(classification.status);
      setSpeciesQuery("");
      setShapeQuery("");
    }
  }, [classification, shapes]);

  useEffect(() => {
    if (!classification) return;
    const changed =
      selectedSpecies !== classification.taggedSpecies ||
      selectedShape !== classification.taggedShape ||
      isHealthy !== classification.isHealthy ||
      selectedStatus !== classification.status;
    setEnableButton(changed);
  }, [
    selectedSpecies,
    selectedShape,
    isHealthy,
    classification,
    selectedStatus,
  ]);

  useEffect(() => {
    if (selectedShape) {
      const shape = shapes.find((s) => s.nameEn === selectedShape);
      if (shape) {
        setShapeSrc(shapeUrlByKey[shape.key] || "");
      }
    }
  }, [selectedShape, shapes]);

  const handleUpdateClassification = async (e) => {
    e.preventDefault();
    await updateClassification(id, {
      taggedSpecies: selectedSpecies,
      taggedShape: selectedShape,
      isHealthy,
      status: selectedStatus,
    })
      .then(() => {
        showNotification({
          title: "Classification tags updated successfully",
          type: "success",
        });
      })
      .catch((error) => {
        showNotification({
          title: "Error updating classification tags",
          type: "error",
        });
      });
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "VERIFIED", label: "Verified" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const statusBadge = getStatusBadge(
    classification?.isArchived ? "ARCHIVED" : classification?.status
  );
  const StatusIcon = statusBadge.icon;
  const datasetFilename = classification?.imagePath.split("/").pop();

  return (
    <>
      {classification && (
        <div className="space-y-6  flex flex-col md:flex-row  gap-4 md:gap-8 w-full">
          <div className="flex flex-col w-full md:w-1/2  ">
            <h1 className="text-lg font-medium text-green-700 pb-2">
              Image Details{" "}
            </h1>
            <div className=" rounded-2xl overflow-hidden mb-2  w-full max-w-[250px]  md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px]">
              <img
                src={classification.imagePath}
                alt={classification.originalFilename}
                className="w-full h-full object-cover m-auto "
              />
            </div>
            <div className="flex flex-col gap-2 border-b border-gray-200 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Original filename
                </p>
                <p className="">{classification.originalFilename}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Dataset filename
                </p>
                <p className="">{datasetFilename}</p>
              </div>
            </div>
            <div className="flex flex-col border-b border-gray-200 pt-4 md: border-none">
              <h1 className="text-lg font-medium text-green-700">
                Verification Status
              </h1>
              <div className="flex flex-col gap-2 border-gray-200 pt-2">
                <div
                  className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium self-start  ${statusBadge.color} `}
                >
                  <StatusIcon className="h-3 w-3 mr-2" />
                  {classification.status}
                </div>
              </div>
              {user?.role == "ADMIN" && (
                <div className="flex flex-col gap-2 pt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Change Status
                  </label>
                  <Combobox
                    onChange={(value) => setSelectedStatus(value)}
                    value={selectedStatus}
                  >
                    <div className="relative">
                      <ComboboxInput
                        id="species"
                        name="species"
                        className="block w-full rounded-md border-gray-400 border-2 focus:ring-green-500 focus:ring-2 p-1"
                        placeholder="Select a species"
                      />
                      <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                      </ComboboxButton>
                      <ComboboxOptions className="absolute z-10 left-0 right-0 top-full mt-1 md:top-auto md:mt-0 md:bottom-full md:mb-1 max-h-60 w-full overflow-y-scroll rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {statusOptions.map((status) => (
                          <ComboboxOption
                            key={status.value}
                            value={status.value}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
                                active
                                  ? "bg-green-100 text-green-900"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {status.label}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    </div>
                  </Combobox>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/2">
            <div className="flex gap-4 flex-col pb-4 border-b border-gray-200 mb-4">
              <h1 className="text-lg font-medium text-green-700">
                Model Output
              </h1>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Species
                </label>
                <ClassificationBadge
                  classification={`${classification?.scientificName} | ${classification?.commonName}`}
                  confidence={classification?.speciesConfidence}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Shape
                </label>
                <ClassificationBadge
                  classification={classification?.shape}
                  confidence={classification?.shapeConfidence}
                />
              </div>
            </div>

            <h1 className="text-lg font-medium text-green-700 pb-2">
              Update Model Tags
            </h1>
            <form
              onSubmit={handleUpdateClassification}
              className="flex flex-col gap-2"
            >
              <div className="flex flex-col">
                <label
                  htmlFor="species"
                  className="text-sm font-medium text-gray-700"
                >
                  Species
                </label>
                <Combobox value={selectedSpecies} onChange={setSelectedSpecies}>
                  <div className="relative mt-2">
                    <ComboboxInput
                      id="species"
                      name="species"
                      className="block w-full rounded-md border-gray-400 border-2 focus:ring-green-500 focus:ring-2 p-1"
                      displayValue={(val) => {
                        if (!val) return "";
                        const s = species.find((sp) => sp.key === val);
                        return s
                          ? `${s.scientificName} - ${s.commonNameEn}`
                          : "";
                      }}
                      onChange={(e) => setSpeciesQuery(e.target.value)}
                      placeholder="Select a species"
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
                      <FaChevronDown className="h-4 w-4 text-gray-500" />
                    </ComboboxButton>
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {species
                        .filter((sp) => {
                          if (!speciesQuery) return true;
                          const label =
                            `${sp.scientificName} ${sp.commonNameEn}`.toLowerCase();
                          return label.includes(speciesQuery.toLowerCase());
                        })
                        .map((sp) => (
                          <ComboboxOption
                            key={sp.id}
                            value={sp.key}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
                                active
                                  ? "bg-green-100 text-green-900"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {`${sp.scientificName} - ${sp.commonNameEn}`}
                          </ComboboxOption>
                        ))}
                      {species.length === 0 && (
                        <div className="py-2 px-3 text-gray-500">
                          No species found
                        </div>
                      )}
                    </ComboboxOptions>
                  </div>
                </Combobox>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="shape"
                  className="text-sm font-medium text-gray-700"
                >
                  Shape
                </label>
                <Combobox value={selectedShape} onChange={setSelectedShape}>
                  <div className="relative mt-2">
                    <ComboboxInput
                      id="shape"
                      name="shape"
                      className="block w-full rounded-md border-gray-400 border-2 focus:ring-green-500 focus:ring-2 p-1"
                      displayValue={(val) => {
                        if (!val) return "";
                        const sh = shapes.find(
                          (s) => `${s.nameEn}` === `${val}`
                        );
                        return sh ? sh.nameEn : "";
                      }}
                      onChange={(e) => setShapeQuery(e.target.value)}
                      placeholder="Select a shape"
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
                      <FaChevronDown className="h-4 w-4 text-gray-500" />
                    </ComboboxButton>
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {shapes
                        .filter((s) => {
                          if (!shapeQuery) return true;
                          return (s.nameEn || "")
                            .toLowerCase()
                            .includes(shapeQuery.toLowerCase());
                        })
                        .map((s, index) => (
                          <ComboboxOption
                            key={s.id ?? index}
                            value={s.nameEn}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-3 pr-4 flex items-center gap-2 ${
                                active
                                  ? "bg-green-100 text-green-900"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {s.nameEn}{" "}
                            <img
                              src={shapeUrlByKey[s.key]}
                              alt={s.nameEn}
                              className="h-10"
                            />
                          </ComboboxOption>
                        ))}
                      {shapes.length === 0 && (
                        <div className="py-2 px-3 text-gray-500">
                          No shapes found
                        </div>
                      )}
                    </ComboboxOptions>
                  </div>
                </Combobox>
              </div>
              {selectedShape && (
                <img
                  src={shapeSrc}
                  alt={selectedShape}
                  className="w-32 h-auto mx-auto"
                />
              )}
              <Switch
                defaultValue={isHealthy}
                isSelected={isHealthy}
                onChange={setIsHealthy}
                className={() => `
                          flex items-center gap-3 select-none mt-2
                          ${
                            loadingSpecies
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        `}
              >
                {({ isSelected }) => (
                  <>
                    <div
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200
                                ${isSelected ? "bg-green-600" : "bg-red-300"}
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
              <button
                disabled={!enableButton}
                type="submit"
                className={cn(
                  "mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm",
                  "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                  enableButton
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default EditClassificationForm;
