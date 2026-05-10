import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import BotStatus from '../../components/chatbot/BotStatus';
import BotConfigForm from '../../components/chatbot/BotConfigForm';
import BotSimulator from '../../components/chatbot/BotSimulator';
import BotLogs from '../../components/chatbot/BotLogs';

const Chatbot = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [aiConfig, setAiConfig] = useState({
    AI_BASE_URL: 'http://localhost:11434/v1',
    DEFAULT_MODEL: 'qwen2.5:3b',
    MAX_TOKENS: '1000',
    prompt: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/chatbot/configs');
      const configMap = {};
      res.configs.forEach(c => configMap[c.configKey] = c.configValue);

      setAiConfig({
        AI_BASE_URL: configMap.AI_BASE_URL || 'http://localhost:11434/v1',
        DEFAULT_MODEL: configMap.DEFAULT_MODEL || 'qwen2.5:3b',
        MAX_TOKENS: configMap.MAX_TOKENS || '1000',
        prompt: res.prompt || configMap['CHATBOT_PROMPT'] || ''
      });
    } catch (err) {
      console.error('Failed to fetch configs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleRefreshLogs = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleConfigChange = (newConfig) => {
    setAiConfig(prev => ({ ...prev, ...newConfig }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-lg animate-in fade-in slide-in-from-bottom-4 duration-700 pb-xl">
      {/* Overview Section */}
      <BotStatus />

      {/* Main Configuration & Simulator Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
        <div className="xl:col-span-2">
          <BotConfigForm config={aiConfig} onChange={handleConfigChange} />
        </div>
        <div className="xl:col-span-1">
          <BotSimulator onNewLog={handleRefreshLogs} currentPrompt={aiConfig.prompt} />
        </div>
      </div>

      {/* History Logs Section */}
      <BotLogs refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default Chatbot;
