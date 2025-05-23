
import Layout from "@/components/layout/Layout";
import AuthTabs from "@/components/auth/AuthTabs";

const Login = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to NaijaRentHub</h1>
          <AuthTabs />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
