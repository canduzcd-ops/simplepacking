import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { ScenarioList } from './components/ScenarioList';
import { ScenarioDetail } from './components/ScenarioDetail';
import { SettingsModal } from './components/SettingsModal';
import { usePackingStore } from './store/packingStore';

function App() {
    const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { settings } = usePackingStore();

    // Initialize theme and language from store on mount
    useEffect(() => {
        document.documentElement.lang = settings.language;
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <Layout>
            <Header onOpenSettings={() => setIsSettingsOpen(true)} />

            {selectedScenarioId ? (
                <ScenarioDetail
                    scenarioId={selectedScenarioId}
                    onBack={() => setSelectedScenarioId(null)}
                />
            ) : (
                <ScenarioList onSelectScenario={setSelectedScenarioId} />
            )}

            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </Layout>
    );
}

export default App;
