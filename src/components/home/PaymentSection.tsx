
import { Button } from "@/components/ui/button";

const PaymentSection = () => {
  return (
    <section className="py-16 bg-naija-accent">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-naija-dark">Secure Payments with Paystack</h2>
            <p className="mb-6 text-gray-600">
              We've integrated with Paystack to ensure your rental payments are secure, 
              transparent, and hassle-free. Pay your rent online with Nigeria's most trusted 
              payment platform.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure transactions with bank-level encryption</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Multiple payment options including cards, bank transfers, and USSD</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant payment confirmations and receipts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Payment plans and installment options</span>
              </li>
            </ul>
            <Button className="bg-naija-primary hover:bg-naija-primary/90">Learn More</Button>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md">
              <img 
                src="https://assets-global.website-files.com/5e73a1e3ba24f239bc2359dc/61f1da382f5cece7d82a45a0_paystack-logo.png"
                alt="Paystack Logo" 
                className="h-12 mb-6" 
              />
              <div className="bg-gray-100 p-6 rounded-lg w-full mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                    <input
                      type="text"
                      className="py-3 px-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-naija-primary focus:ring-naija-primary bg-white"
                      value="500,000"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="py-3 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-naija-primary focus:ring-naija-primary bg-white"
                    placeholder="youremail@example.com"
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Pay with Paystack
                </Button>
              </div>
              <div className="flex justify-center space-x-4">
                <img src="https://res.cloudinary.com/paystack/image/upload/v1653566331/visa-logo_sdgm3l.png" alt="Visa" className="h-6" />
                <img src="https://res.cloudinary.com/paystack/image/upload/v1653566331/mastercard-logo_ktxsnf.png" alt="Mastercard" className="h-6" />
                <img src="https://nigerianbanks.xyz/logo/verve-logo.png" alt="Verve" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
