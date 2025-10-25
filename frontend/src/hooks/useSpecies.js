import { useState, useEffect } from "react";
import useStore from "./useStore";
import speciesService from "../Services/species";

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

  return { species, shapes, loading, error, getSpecies };
}
export default useSpecies;
