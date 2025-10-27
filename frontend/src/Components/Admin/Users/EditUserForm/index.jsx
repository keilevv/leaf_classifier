import DetailsForm from "../../../Settings/DetailsForm";
import useAdmin from "../../../../hooks/useAdmin";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function EditUserForm() {
  const { id } = useParams();
  const { user, getUser, isLoading } = useAdmin();

  useEffect(() => {
    getUser(id);
  }, [id]);

  return <DetailsForm user={user} loading={isLoading} />;
}
export default EditUserForm;
