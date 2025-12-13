import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home';
import { CreateStoryPage } from './pages/CreateStory';
import { SettingsPage } from './pages/Settings';
import { EditorPage } from './pages/Editor';
import { LockScreen } from './components/ui/LockScreen';

function App() {
  return (
    <>
      <LockScreen />
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateStoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/story/:id" element={<EditorPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
