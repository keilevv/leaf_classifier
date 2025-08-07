import plantClassifierService from "../Services/plantClassifier";
function useClassifier() {
  function uploadImage(imageData) {
    return plantClassifierService
      .uploadImage(imageData)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        throw error;
      });
  }
  return { uploadImage };
}
export default useClassifier;
