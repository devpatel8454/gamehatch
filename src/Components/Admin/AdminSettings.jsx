import { useState, useEffect } from 'react';
import { FaCog, FaSave, FaBell, FaShield, FaPalette, FaDatabase } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'GameHach',
    siteDescription: 'Your ultimate gaming destination',
    allowRegistration: true,
    requireEmailVerification: true,
    enableMaintenanceMode: false,
    maxUploadSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,gif',
    smtpEnabled: false,
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    analyticsEnabled: true,
    backupEnabled: true,
    backupFrequency: 'daily'
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://localhost:7270/api/Settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7270/api/Settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: FaCog },
    { id: 'security', name: 'Security', icon: FaShield },
    { id: 'email', name: 'Email', icon: FaBell },
    { id: 'system', name: 'System', icon: FaDatabase }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
          <p className="text-gray-400">Configure your gaming platform</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <FaSave />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-red-400 border-b-2 border-red-400 bg-gray-700'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="allowRegistration" className="text-gray-300">Allow user registration</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="requireEmailVerification" className="text-gray-300">Require email verification for new accounts</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableMaintenanceMode"
                    checked={settings.enableMaintenanceMode}
                    onChange={(e) => handleInputChange('enableMaintenanceMode', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="enableMaintenanceMode" className="text-gray-300">Enable maintenance mode</label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Upload Size (MB)</label>
                  <input
                    type="number"
                    value={settings.maxUploadSize}
                    onChange={(e) => handleInputChange('maxUploadSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Allowed File Types</label>
                  <input
                    type="text"
                    value={settings.allowedFileTypes}
                    onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="jpg,jpeg,png,gif"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'email' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="smtpEnabled"
                  checked={settings.smtpEnabled}
                  onChange={(e) => handleInputChange('smtpEnabled', e.target.checked)}
                  className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <label htmlFor="smtpEnabled" className="text-gray-300 font-semibold">Enable SMTP Email Service</label>
              </div>

              {settings.smtpEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
                    <input
                      type="text"
                      value={settings.smtpPort}
                      onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Username</label>
                    <input
                      type="text"
                      value={settings.smtpUsername}
                      onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Password</label>
                    <input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onChange={(e) => handleInputChange('analyticsEnabled', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="analyticsEnabled" className="text-gray-300">Enable analytics tracking</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="backupEnabled"
                    checked={settings.backupEnabled}
                    onChange={(e) => handleInputChange('backupEnabled', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="backupEnabled" className="text-gray-300">Enable automatic backups</label>
                </div>
              </div>

              {settings.backupEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
