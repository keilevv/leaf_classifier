import { useEffect, useMemo, useState, useRef } from "react";
import { showNotification } from "../../Common/Notification";
import useClassifier from "../../../hooks/useClassifier";

function ModelSettings() {
  const {
    listModels,
    getModelVersions,
    models,
    speciesVersions,
    restoreModelVersion,
    retrainModel,
    getTrainingStatus,
    trainingStatus,
    isLoading,
    error,
  } = useClassifier();

  const [selectedVersion, setSelectedVersion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const pollingIntervalRef = useRef(null);

  // Determine if training is in progress from the status endpoint
  const isTrainingInProgress = trainingStatus?.is_training === true;

  useEffect(() => {
    listModels();
  }, [listModels]);

  useEffect(() => {
    if (models.length > 0) {
      models.forEach((model) => {
        if (model === "especies") {
          getModelVersions(model);
        }
      });
    }
  }, [models, getModelVersions]);

  useEffect(() => {
    if (!speciesVersions?.versions?.length) {
      setSelectedVersion(null);
    }
  }, [speciesVersions]);

  // Check initial status on mount
  useEffect(() => {
    const model = "especies";
    getTrainingStatus(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Set up polling when training status changes
  useEffect(() => {
    const model = "especies";

    // Update local state based on training status from endpoint
    setIsRetraining(trainingStatus?.is_training === true);

    if (trainingStatus?.is_training) {
      // Start polling if training is in progress
      pollingIntervalRef.current = setInterval(() => {
        getTrainingStatus(model).then((status) => {
          if (status && !status.is_training) {
            // Training completed
            setIsRetraining(false);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            // Refresh versions list
            getModelVersions(model);
          }
        });
      }, 5000); // Poll every 5 seconds
    } else {
      // Stop polling if training is not in progress
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    // Cleanup on unmount or when training status changes
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingStatus?.is_training]); // Only depend on is_training to avoid infinite loops

  const sortedVersions = useMemo(() => {
    if (!speciesVersions?.versions) return [];
    return [...speciesVersions.versions].sort((a, b) => b.version - a.version);
  }, [speciesVersions]);

  const handleSelect = (versionNumber) => {
    setSelectedVersion(versionNumber);
    setFeedback(null);
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    try {
      await restoreModelVersion("especies", selectedVersion);
      setFeedback({
        type: "success",
        message: `Version ${selectedVersion} restored successfully.`,
      });
      showNotification({
        type: "success",
        title: "Version restored",
        message: `Version ${selectedVersion} restored successfully.`,
      });
      await getModelVersions("especies");
    } catch (err) {
      setFeedback({
        type: "error",
        message: "Could not restore the version. Please try again.",
      });
      showNotification({
        type: "error",
        title: "Restore failed",
        message:
          err?.response?.data?.error ||
          err?.message ||
          "Could not restore the version. Please try again.",
      });
    }
  };

  const handleRetrain = async () => {
    // Check training status before attempting to retrain
    const model = "especies";
    try {
      setFeedback(null);

      // Refresh training status before attempting retrain
      const status = await getTrainingStatus(model);
      if (status?.is_training) {
        setFeedback({
          type: "error",
          message:
            "Training is already in progress. Please wait for it to complete.",
        });
        return;
      }

      await retrainModel(model);
      setFeedback({
        type: "success",
        message: "Model retraining started. This may take several minutes.",
      });
      showNotification({
        type: "success",
        title: "Retraining started",
        message: "Model retraining started. This may take several minutes.",
      });
      // Refresh status after starting to update button state
      await getTrainingStatus(model);
      // Status polling will be handled by the useEffect
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Could not start retraining. Please try again.";
      setFeedback({
        type: "error",
        message: errorMessage,
      });
      showNotification({
        type: "error",
        title: "Retraining failed",
        message: errorMessage,
      });
      // Refresh status in case of error
      getTrainingStatus(model);
    }
  };

  const renderFeedback = () => {
    const activeMessage =
      feedback ||
      (error && {
        type: "error",
        message: "There was an error loading the information.",
      });
    if (!activeMessage) return null;
    return (
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          backgroundColor:
            activeMessage.type === "success" ? "#e8f5e9" : "#ffebee",
          color: activeMessage.type === "success" ? "#1b5e20" : "#b71c1c",
        }}
      >
        {activeMessage.message}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-xl font-medium text-green-700">Model Settings</h1>
      <section style={{ marginTop: "2rem" }}>
        <header style={{ marginBottom: "1rem" }}>
          <h2>Species model versions</h2>
          <p style={{ color: "#555" }}>Select a version to restore it.</p>
        </header>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "640px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>
                  Version
                </th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>
                  Generated
                </th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>File</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Notes</th>
                <th style={{ textAlign: "center", padding: "0.75rem" }}>
                  Select
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVersions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      color: "#777",
                    }}
                  >
                    {isLoading
                      ? "Loading versions..."
                      : "No versions are registered for this model."}
                  </td>
                </tr>
              ) : (
                sortedVersions.map((version) => {
                  const formattedDate = version.timestamp
                    ? new Date(version.timestamp).toLocaleString()
                    : "-";
                  const formattedSize = version.size_bytes
                    ? `${(version.size_bytes / (1024 * 1024)).toFixed(2)} MB`
                    : "-";
                  const isSelected = selectedVersion === version.version;

                  return (
                    <tr
                      key={version.version}
                      style={{
                        borderBottom: "1px solid #eee",
                        backgroundColor: isSelected ? "#e3f2fd" : "transparent",
                      }}
                    >
                      <td style={{ padding: "0.75rem" }}>v{version.version}</td>
                      <td style={{ padding: "0.75rem" }}>{formattedDate}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{version.filename}</span>
                          <span style={{ color: "#777", fontSize: "0.85rem" }}>
                            {formattedSize}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        {version.notes || "-"}
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "center" }}>
                        <input
                          type="radio"
                          name="species-version"
                          checked={isSelected}
                          onChange={() => handleSelect(version.version)}
                          aria-label={`Seleccionar versión ${version.version}`}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleRestore}
            disabled={!selectedVersion || isLoading || isTrainingInProgress}
            style={{
              padding: "0.65rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor:
                !selectedVersion || isLoading || isTrainingInProgress
                  ? "#cfd8dc"
                  : "#1976d2",
              color: "#fff",
              cursor:
                !selectedVersion || isLoading || isTrainingInProgress
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isLoading ? "Restoring..." : "Restore version"}
          </button>
          <button
            type="button"
            onClick={handleRetrain}
            disabled={isLoading || isTrainingInProgress}
            style={{
              padding: "0.65rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor:
                isLoading || isTrainingInProgress ? "#cfd8dc" : "#2e7d32",
              color: "#fff",
              cursor:
                isLoading || isTrainingInProgress ? "not-allowed" : "pointer",
            }}
          >
            {isTrainingInProgress ? "Training in progress..." : "Retrain model"}
          </button>
          {isTrainingInProgress && trainingStatus?.started_at && (
            <div
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e3f2fd",
                borderRadius: "6px",
                fontSize: "0.9rem",
                color: "#1976d2",
              }}
            >
              Started: {new Date(trainingStatus.started_at).toLocaleString()}
            </div>
          )}
          {renderFeedback()}
        </div>
      </section>
    </div>
  );
}
export default ModelSettings;
