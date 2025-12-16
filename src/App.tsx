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
  const [editingItem, setEditingItem] = useState<any>(null); // NEW state for edit
  const [selectedItem, setSelectedItem] = useState<any>(null); // Lifted state

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleOpenItem = (item: any) => {
    setSelectedItem(item);
    setView('vault');
  };

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

        {view === 'dashboard' && <Dashboard onNavigate={setView} onOpenItem={handleOpenItem} />}



        {view === 'vault' && (
          <VaultList
            category="login"
            items={isLoading ? [] : vaultItems}
            searchTerm={searchTerm}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem} // Pass callback
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
          />
        )}

        {view === 'cards' && (
          <VaultList
            category="card"
            items={isLoading ? [] : vaultItems}
            searchTerm={searchTerm}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem} // Pass callback
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
          />
        )}

        {view === 'generator' && <PasswordGenerator />}
        {view === 'security' && <SecurityCheck onNavigate={setView} />}
        {view === 'settings' && <Settings />}

        {/* ... */}

        {showAddModal && (
          <AddItemModal
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null); // Clear edit state on close
            }}
            initialData={editingItem} // Pass data if editing
            onSuccess={() => {
              setShowAddModal(false);
              setEditingItem(null); // Clear edit state on success
              setRefreshKey(prev => prev + 1);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
