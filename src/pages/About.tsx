
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About NaijaRentHub</h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              NaijaRentHub aims to revolutionize the Nigerian real estate market by providing a seamless platform 
              connecting tenants with quality rental properties and verified agents. We're committed to 
              transparency, affordability, and accessibility in the rental process.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2023, NaijaRentHub was born out of the frustration experienced in finding suitable 
              rental accommodation in Nigeria's major cities. Our team of real estate professionals and 
              technology experts have come together to create a platform that simplifies the rental process.
            </p>
            <p className="text-gray-700 mb-4">
              We verify all agents on our platform and ensure that property listings meet our quality standards, 
              giving renters peace of mind and landlords a reliable channel to find quality tenants.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700 mb-4">
              We envision a future where finding a rental property in Nigeria is stress-free, transparent, and 
              fair for all parties involved. NaijaRentHub is working towards digitizing and optimizing every 
              aspect of the rental journey, from property search to lease signing and payment.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Why Choose NaijaRentHub</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="font-medium mb-2">Verified Listings</h3>
                <p className="text-gray-600">All properties are verified to ensure accuracy and availability.</p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="font-medium mb-2">Trusted Agents</h3>
                <p className="text-gray-600">We vet all agents to ensure professionalism and reliability.</p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="font-medium mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">No hidden fees or charges—what you see is what you pay.</p>
              </div>
              <div className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="font-medium mb-2">Easy Communication</h3>
                <p className="text-gray-600">Direct contact with property agents without intermediaries.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <p className="text-gray-700">
              Email: <a href="mailto:info@naijarenthub.com" className="text-naija-primary hover:underline">info@naijarenthub.com</a><br />
              Phone: +234 800 123 4567<br />
              Address: Plot 123, Victoria Island, Lagos, Nigeria
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
