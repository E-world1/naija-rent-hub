
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ConversationList from "@/components/communication/ConversationList";
import ChatContainer from "@/components/communication/ChatContainer";

const Messages = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          <div className="md:col-span-1 border rounded-lg overflow-hidden">
            <ConversationList />
          </div>
          
          <div className="md:col-span-2 lg:col-span-3 border rounded-lg overflow-hidden">
            {conversationId ? (
              <ChatContainer />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a conversation from the list or start a new one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
