import { Layout } from "../../components";
import { Private } from "../../components/auth";
const UserIndex = ({ children }) => {
  return (
    <Layout>
      <Private>User dashboard</Private>
    </Layout>
  );
};

export default UserIndex;
