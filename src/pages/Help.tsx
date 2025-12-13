import { ChevronLeft, Download, Shield, Wifi, ScanLine, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { version } from '../../package.json';

export function HelpPage() {
  return (
    <div className="pb-20">
      <header className="sticky top-0 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border z-10 px-4 py-3 flex items-center gap-3">
        <Link to="/settings" className="text-gray-500 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="font-bold text-lg dark:text-dark-text">Help & Guide</h1>
      </header>

      <div className="p-4 space-y-6 max-w-md mx-auto">

        {/* Quick Tips */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-wide mb-3">Quick Tips</h2>
          <div className="space-y-3">
            <HelpCard
              icon={<Download size={20} />}
              title="Exporting Stories"
              text="Use the 'Share' button inside a story to download a ZIP file containing your text and all photos."
            />
            <HelpCard
              icon={<Shield size={20} />}
              title="Panic Button"
              text="In Settings, the Panic Button will instantly wipe all data from this device. This cannot be undone."
            />
            <HelpCard
              icon={<Wifi size={20} />}
              title="Offline Mode"
              text="Pocket Reporter works offline. You only need internet to download new templates or app updates."
            />
            <HelpCard
              icon={<ScanLine size={20} />}
              title="Document Scanner"
              text="Use the Scan button to photograph documents, receipts, or letters. Text is extracted automatically using OCR for easy editing."
            />
            <HelpCard
              icon={<Camera size={20} />}
              title="Media Gallery"
              text="Tap photos to view fullscreen. Tap audio recordings to play/pause. All media is saved locally with your story."
            />
          </div>
        </section>

        {/* FAQ Accordion */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-wide mb-3">Frequently Asked Questions</h2>
          <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl divide-y divide-gray-100 dark:divide-dark-border">
            <FaqItem
              q="Where is my data stored?"
              a="All data is stored locally on your device in the browser's IndexedDB. We do not have a server database."
            />
            <FaqItem
              q="What if I clear my browser history?"
              a="WARNING: Clearing your browser's 'Site Data' or 'Cookies' may delete your stories. Use the Export feature regularly to backup your work."
            />
            <FaqItem
              q="How do I update templates?"
              a="The app checks for updates automatically when you open it while online. If a new version is found, it will replace the old templates."
            />
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center py-8 text-gray-400 dark:text-dark-text-muted text-xs">
          <p>Pocket Reporter v{version}</p>
          <p>Open Source Journalism Tool</p>
        </div>
      </div>
    </div>
  );
}

function HelpCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm flex gap-4">
      <div className="text-brand bg-brand-light dark:bg-brand/20 h-10 w-10 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-dark-text mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-dark-text-muted leading-snug">{text}</p>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  return (
    <details className="group p-4 open:bg-gray-50 dark:open:bg-dark-border transition-colors">
      <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 dark:text-dark-text">
        {q}
        <span className="transition group-open:rotate-180">
          <ChevronLeft size={16} className="-rotate-90" />
        </span>
      </summary>
      <div className="text-gray-600 dark:text-dark-text-muted text-sm mt-3 leading-relaxed">
        {a}
      </div>
    </details>
  );
}
