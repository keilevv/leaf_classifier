import { Combobox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import ClassificationBadge from "../../../Common/Classifications/ClassificationBadge";
import useSpecies from "../../../../hooks/useSpecies";
import { useEffect, useState } from "react";
import { Switch } from "react-aria-components";
import { cn } from "../../../../utils";

const shapesPath = "/src/assets/images/shapes/";

function EditClassificationForm({ selectedUpload }) {
  const { species, loading, getSpecies, shapes } = useSpecies();
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [isHealthy, setIsHealthy] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [shapeQuery, setShapeQuery] = useState("");
  const [shapeSrc, setShapeSrc] = useState(`${shapesPath}lanceolate.webp`);

  useEffect(() => {
    if (selectedUpload) {
      getSpecies();
    }
  }, [selectedUpload]);

  useEffect(() => {
    if (selectedUpload) {
      setIsHealthy(selectedUpload.isHealthy);
      setSelectedSpecies(selectedUpload.species);
      setSelectedShape(selectedUpload.shape);
      setSpeciesQuery("");
      setShapeQuery("");
    }
  }, [selectedUpload, shapes]);

  useEffect(() => {
    if (!selectedUpload) return;
    const changed =
      selectedSpecies !== selectedUpload.species ||
      selectedShape !== selectedUpload.shape ||
      isHealthy !== selectedUpload.isHealthy;
    setEnableButton(changed);
  }, [selectedSpecies, selectedShape, isHealthy, selectedUpload]);

  useEffect(() => {
    if (selectedShape) {
      const shape = shapes.find((s) => s.nameEn === selectedShape);
      if (shape) {
        setShapeSrc(`${shapesPath}${shape.key}.webp`);
      }
    }
  }, [selectedShape, shapes]);

  const handleUpdateClassification = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      {selectedUpload && (
        <div className="space-y-6  flex flex-col-reverse md:flex-row gap-4 w-full">
          <div className="flex flex-col w-full md:w-1/2">
            <div className="flex gap-4 flex-col border-b border-gray-200 pb-4 mb-4">
              <h1 className="text-lg font-medium text-green-700">
                Model Output
              </h1>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Species
                </label>
                <ClassificationBadge
                  classification={selectedUpload.species}
                  confidence={selectedUpload.speciesConfidence}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Shape
                </label>
                <ClassificationBadge
                  classification={selectedUpload.shape}
                  confidence={selectedUpload.shapeConfidence}
                />
              </div>
            </div>
            <h1 className="text-lg font-medium text-green-700 pb-2">
              Change Tags
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
                    <Combobox.Input
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
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                      <FaChevronDown className="h-4 w-4 text-gray-500" />
                    </Combobox.Button>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {species
                        .filter((sp) => {
                          if (!speciesQuery) return true;
                          const label =
                            `${sp.scientificName} ${sp.commonNameEn}`.toLowerCase();
                          return label.includes(speciesQuery.toLowerCase());
                        })
                        .map((sp) => (
                          <Combobox.Option
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
                          </Combobox.Option>
                        ))}
                      {species.length === 0 && (
                        <div className="py-2 px-3 text-gray-500">
                          No species found
                        </div>
                      )}
                    </Combobox.Options>
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
                    <Combobox.Input
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
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                      <FaChevronDown className="h-4 w-4 text-gray-500" />
                    </Combobox.Button>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {shapes
                        .filter((s) => {
                          if (!shapeQuery) return true;
                          return (s.nameEn || "")
                            .toLowerCase()
                            .includes(shapeQuery.toLowerCase());
                        })
                        .map((s, index) => (
                          <Combobox.Option
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
                              src={`${shapesPath}${s.key}.webp`}
                              alt={s.nameEn}
                              className="h-10"
                            />
                          </Combobox.Option>
                        ))}
                      {shapes.length === 0 && (
                        <div className="py-2 px-3 text-gray-500">
                          No shapes found
                        </div>
                      )}
                    </Combobox.Options>
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
                            loading
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
          <div className="flex flex-col m-auto ">
            <div className=" rounded-2xl overflow-hidden mb-2  w-full max-w-[200px] md:max-w-[350px]">
              <img
                src={selectedUpload.imagePath}
                alt={selectedUpload.originalFilename}
                className="w-full h-full object-cover m-auto "
              />
            </div>
            <h1 className="text-lg font-medium text-green-700 text-center">
              {selectedUpload.originalFilename}
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
export default EditClassificationForm;
