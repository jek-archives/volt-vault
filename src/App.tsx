import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { VaultList } from './components/VaultList';
import { PasswordGenerator } from './components/PasswordGenerator';
import { Settings } from './components/Settings';
import { SecurityCheck } from './components/SecurityCheck';
import './index.css';
import { Auth } from './components/Auth';
import { AddItemModal } from './components/AddItemModal';

import { api } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // GLOBAL STATE
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data globally
  useEffect(() => {
    setIsLoading(true);
    api.getVaultItems()
      .then(data => {
        setVaultItems(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [refreshKey]);

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteVaultItem(id);
      setRefreshKey(prev => prev + 1); // Trigger refetch
    } catch (e) {
      alert("Failed to delete item.");
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'black', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* SIDEBAR (Pass item count) */}
      <Sidebar
        view={view}
        setView={setView}
        onLogout={() => setIsAuthenticated(false)}
        totalItems={vaultItems.length}
      />

      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, display: 'flex', flexDirection: 'column' }} className="diagonal-stripe">

        <Header
          onAddClick={() => setShowAddModal(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {view === 'dashboard' && <Dashboard onNavigate={setView} />}

        {view === 'vault' && (
          <VaultList
            category="login"
            items={isLoading ? [] : vaultItems}
            searchTerm={searchTerm}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {view === 'cards' && (
          <VaultList
            category="card"
            items={isLoading ? [] : vaultItems}
            searchTerm={searchTerm}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {view === 'security' && <SecurityCheck onNavigate={setView} />}

        {view === 'generator' && (
          <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h2 className="font-tech text-yellow" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Password Generator Tools</h2>
            <PasswordGenerator />
          </div>
        )}

        {view === 'settings' && <Settings />}

        {showAddModal && (
          <AddItemModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              setRefreshKey(prev => prev + 1);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
