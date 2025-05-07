
import Layout from "@/components/layout/Layout";
import AddPropertyForm from "@/components/properties/AddPropertyForm";

const AddProperty = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">List Your Property</h1>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <AddPropertyForm />
        </div>
      </div>
    </Layout>
  );
};

export default AddProperty;
