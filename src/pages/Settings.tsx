import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trash2, AlertTriangle, HelpCircle, Download, Upload, Loader2, Sun, Moon, Monitor } from 'lucide-react';
import { useSecurity } from '../hooks/useSecurity';
import { useThemeContext } from '../components/ui/ThemeProvider';
import { db } from '../lib/db';
import { exportDatabase, importDatabase } from '../lib/backup';

export function SettingsPage() {
  const { hasPin, setPin, triggerPanic } = useSecurity();
  const { theme, setTheme } = useThemeContext();
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSetPin = () => {
    const newPin = prompt("Enter a new 4-digit PIN:");
    if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
      setPin(newPin);
      alert("PIN set successfully.");
    } else {
      alert("Invalid PIN. Must be 4 digits.");
    }
  };

  const handleClearData = async () => {
    if (confirm("Are you sure? This deletes ALL stories.")) {
      await db.stories.clear();
      await db.media.clear();
      alert("All stories deleted.");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportDatabase();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pocket-reporter-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('This will replace ALL existing data. Are you sure?')) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    try {
      const result = await importDatabase(file);
      alert(`Import successful!\n\nRestored:\n- ${result.stories} stories\n- ${result.media} media items\n- ${result.contacts} contacts\n- ${result.locations} locations`);
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. The file may be corrupted or invalid.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6 dark:text-dark-text">Settings</h1>

      {/* Security Section */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Security</h2>
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">

          <button
            onClick={handleSetPin}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-border text-left border-b border-gray-200 dark:border-dark-border"
          >
            <div className="bg-brand-light dark:bg-brand/20 p-2 rounded-lg text-brand">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-dark-text">{hasPin ? "Change App PIN" : "Set App PIN"}</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-muted">Protect access to your stories</div>
            </div>
          </button>

          <button
            onClick={() => setShowPanicConfirm(true)}
            className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-left"
          >
            <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-red-700 dark:text-red-400">Panic Button</div>
              <div className="text-xs text-red-600/70 dark:text-red-400/70">Instantly wipe all data</div>
            </div>
          </button>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Appearance</h2>
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <div className="p-4">
            <div className="font-medium text-gray-900 dark:text-dark-text mb-3">Theme</div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-brand bg-brand-light dark:bg-brand/20 text-brand'
                    : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-muted hover:border-gray-300'
                }`}
              >
                <Sun size={18} />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-brand bg-brand-light dark:bg-brand/20 text-brand'
                    : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-muted hover:border-gray-300'
                }`}
              >
                <Moon size={18} />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  theme === 'system'
                    ? 'border-brand bg-brand-light dark:bg-brand/20 text-brand'
                    : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-muted hover:border-gray-300'
                }`}
              >
                <Monitor size={18} />
                <span className="text-sm font-medium">Auto</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Panic Confirmation Modal */}
      {showPanicConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Extreme Danger</h3>
            <p className="text-gray-600 dark:text-dark-text-muted mb-6">
              This will permanently delete ALL stories, photos, and settings. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPanicConfirm(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-dark-border dark:text-dark-text font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={triggerPanic}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg"
              >
                WIPE EVERYTHING
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Section */}
      <section>
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Data</h2>
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-border text-left border-b border-gray-200 dark:border-dark-border disabled:opacity-50"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              {exporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-dark-text">Export Backup</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-muted">Download all data as JSON file</div>
            </div>
          </button>

          <label className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-border text-left border-b border-gray-200 dark:border-dark-border cursor-pointer ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-green-600 dark:text-green-400">
              {importing ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-dark-text">Import Backup</div>
              <div className="text-xs text-gray-500 dark:text-dark-text-muted">Restore from a backup file</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={importing}
            />
          </label>

          <button onClick={handleClearData} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-dark-border text-left">
            <div className="bg-gray-100 dark:bg-dark-border p-2 rounded-lg text-gray-600 dark:text-dark-text-muted">
              <Trash2 size={20} />
            </div>
            <div className="font-medium text-gray-900 dark:text-dark-text">Clear Storage</div>
          </button>
        </div>
      </section>

      {/* Help Section */}
      <section className="mt-8">
        <Link to="/help" className="flex items-center gap-2 text-brand font-medium justify-center p-4 hover:bg-gray-50 dark:hover:bg-dark-border rounded-xl transition-colors">
          <HelpCircle size={20} />
          <span>Help & User Guide</span>
        </Link>
      </section>
    </div>
  );
}
