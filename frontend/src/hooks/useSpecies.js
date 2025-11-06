import { useState, useEffect } from "react";
import useStore from "./useStore";
import speciesService from "../Services/species";
import { showNotification } from "../Components/Common/Notification";

function useSpecies() {
  const [species, setSpecies] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useStore();

  const getSpecies = async (page, limit, sortBy, sortOrder, filters) => {
    setLoading(true);
    try {
      const response = await speciesService.getSpecies(
        page,
        limit,
        sortBy,
        sortOrder,
        filters,
        accessToken
      );
      setSpecies(response.data.results);
      setShapes(response.data.shapes);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const createSpecies = async ({ scientificName, commonNameEn, commonNameEs }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await speciesService.createSpecies(
        { scientificName, commonNameEn, commonNameEs },
        accessToken
      );
      const created = response?.data?.species;
      if (created) {
        setSpecies((prev) => [created, ...prev]);
      }
      showNotification({
        type: "success",
        title: "Species created",
        message: `${created?.scientificName || scientificName} was added successfully`,
      });
      return created;
    } catch (e) {
      setError(e);
      showNotification({
        type: "error",
        title: "Creation failed",
        message: e?.response?.data?.error || "Failed to create species",
      });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { species, shapes, loading, error, getSpecies, createSpecies };
}
export default useSpecies;
