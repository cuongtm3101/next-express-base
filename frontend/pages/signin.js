import { Layout } from "../components";
import { SigninComponent } from "../components/auth";
const Signin = () => {
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
