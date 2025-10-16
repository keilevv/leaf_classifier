import Layout from "../../Components/Layout";
import Admin from "../../Components/Admin";

function AdminPage() {
  return (
    <Layout user={null} initialTab={2}>
      <Admin />
    </Layout>
  );
}

export default AdminPage;
