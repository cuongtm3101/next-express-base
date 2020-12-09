import { Layout } from "../../components";
import { Admin } from "../../components/auth";
const AdminIndex = ({ children }) => {
  return (
    <Layout>
      <Admin>Admin dashboard</Admin>
    </Layout>
  );
};

export default AdminIndex;
