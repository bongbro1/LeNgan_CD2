import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatCustomerInsights from '../../components/chat/ChatCustomerInsights';

const SocialChat = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const lastRepliedId = useRef(null);

  // Initial Data Fetch & Handle selection from Search
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get('/conversations');
        setConversations(response);
        
        const targetCustomerId = location.state?.selectCustomerId;
        const targetCustomerData = location.state?.customer;

        if (targetCustomerId) {
          const targetConv = response.find(c => c.customerId === targetCustomerId);
          if (targetConv) {
            handleChatSelect(targetConv.id);
          } else if (targetCustomerData) {
            // Create a temporary conversation object for a new chat
            const newTempChat = {
              id: 'new',
              customerId: targetCustomerId,
              customer: targetCustomerData,
              messages: [],
              lastMessage: null,
              isTyping: false
            };
            setActiveChat(newTempChat);
          } else if (response.length > 0) {
            handleChatSelect(response[0].id);
          }
        } else if (response.length > 0 && !activeChat) {
          handleChatSelect(response[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [location.state]);

  // Polling for new messages
  useEffect(() => {
    const timer = setInterval(() => {
      fetchData(false); // Fetch list without global loading
      if (activeChat) {
        refreshActiveChat();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [activeChat, aiAssistEnabled]);

  const fetchData = async (showLoading = true) => {
    try {
      const response = await axiosClient.get('/conversations');
      setConversations(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAiAssist = async () => {
    const newValue = !aiAssistEnabled;
    setAiAssistEnabled(newValue);
    try {
      await axiosClient.put('/settings/config/SMART_ASSIST_ENABLED', {
        value: newValue ? 'true' : 'false'
      });
    } catch (err) {
      console.error('Failed to sync Smart Assist state:', err);
    }
  };

  const refreshActiveChat = async () => {
    if (!activeChat) return;
    try {
      const detail = await axiosClient.get(`/conversations/${activeChat.id}`);
      
      // Check for new messages
      if (detail.messages.length !== activeChat.messages.length) {
        setActiveChat(detail);
        // Backend now handles auto-reply, no need to trigger from here
      }
    } catch (err) {
      console.error('Error refreshing chat:', err);
    }
  };

  const handleChatSelect = async (id) => {
    setIsDetailLoading(true);
    try {
      const detail = await axiosClient.get(`/conversations/${id}`);
      setActiveChat(detail);
      // Also fetch config to sync toggle
      const configs = await axiosClient.get('/settings/configs');
      const assistConfig = configs.find(c => c.configKey === 'SMART_ASSIST_ENABLED');
      if (assistConfig) {
        setAiAssistEnabled(assistConfig.configValue === 'true');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeChat) return;
    try {
      // Optimistic update
      const tempId = Date.now();
      const optimisticMsg = { id: tempId, content: text, senderType: 'staff', createdAt: new Date() };
      setActiveChat(prev => ({
        ...prev,
        messages: [...prev.messages, optimisticMsg]
      }));

      let result;
      if (activeChat.id === 'new') {
        const res = await axiosClient.post('/conversations/create-from-customer', {
          text,
          sender: 'user',
          customerId: activeChat.customerId
        });
        result = res.message;
        // Also update the activeChat with real ID from backend
        setActiveChat(res.conversation);
      } else {
        const res = await axiosClient.post(`/conversations/${activeChat.id}/messages`, {
          text,
          sender: 'user'
        });
        result = res.message;
        // Chỉ cập nhật toàn bộ nếu ID thay đổi, còn không thì chỉ thay thế tin nhắn tạm
        if (res.conversation && res.conversation.id !== activeChat.id) {
          setActiveChat(res.conversation);
        } else {
          setActiveChat(prev => ({
            ...prev,
            messages: prev.messages.map(m => m.id === tempId ? result : m)
          }));
        }
      }

      // Update list to show latest message/time
      fetchData(false);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleDeleteConversation = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ cuộc hội thoại này?')) return;
    try {
      await axiosClient.delete(`/conversations/${id}`);
      const updatedList = conversations.filter(c => c.id !== id);
      setConversations(updatedList);
      if (activeChat?.id === id) {
        if (updatedList.length > 0) {
          handleChatSelect(updatedList[0].id);
        } else {
          setActiveChat(null);
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden animate-in fade-in duration-500">
      {/* Header Info (Optional, can be inside MainLayout) */}

      {/* 3-Column Layout Container */}
      <div className="flex flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-outline-variant/30 min-h-0">
        {/* Left Column: Chat List */}
        <ChatList
          chats={conversations}
          activeChatId={activeChat?.id}
          onChatSelect={handleChatSelect}
        />

        {/* Center Column: Chat Window */}
        <ChatWindow
          chat={activeChat}
          onSendMessage={handleSendMessage}
          onDeleteConversation={handleDeleteConversation}
          loading={isDetailLoading}
          aiAssistEnabled={aiAssistEnabled}
          onToggleAiAssist={handleToggleAiAssist}
        />

        {/* Right Column: Customer Details */}
        <ChatCustomerInsights
          customer={activeChat?.customer}
          loading={isDetailLoading}
        />
      </div>
    </div>
  );
};

export default SocialChat;
