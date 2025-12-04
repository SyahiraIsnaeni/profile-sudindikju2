'use client';

import { useChatBot } from '@/presentation/composables/useChatBot';
import { MessageCircle, X, Send } from 'lucide-react';

export const ChatBot = () => {
  const { isOpen, setIsOpen, messages, inputValue, setInputValue, isLoading, handleSendMessage } =
    useChatBot();

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asisten Virtual</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="h-80 bg-gray-50 p-4 overflow-y-auto flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                disabled={isLoading}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-blue-700 transition-all hover:shadow-blue-600/40 hover:scale-110"
      >
        {isOpen ? (
          <X size={24} className="animate-out rotate-90 fade-out duration-300" />
        ) : (
          <MessageCircle size={24} className="animate-in rotate-0 fade-in duration-300" />
        )}
      </button>
    </>
  );
};