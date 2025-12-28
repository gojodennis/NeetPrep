import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle } from 'lucide-react';

const Settings = () => {
    const { addToast } = useToast();
    const { state, setApiKey } = useAppContext();
    const [googleConnected, setGoogleConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(state.config?.apiKey || '');

    const handleSaveKey = () => {
        setApiKey(apiKeyInput);
        addToast("API Key Saved Successfully");
    };

    const handleGoogleConnect = () => {
        setConnecting(true);
        setTimeout(() => {
            setConnecting(false);
            setGoogleConnected(true);
            addToast("Google Account Connected Successfully");
        }, 1500);
    };



    return (
        <div className="view-section active animate-fade-in">
            <header>
                <h1>Settings & Integrations</h1>
            </header>

            <div className="grid">
                <div className="card">
                    <h2>AI Configuration</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Configure your Gemini API key to enable AI features.
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ marginLeft: '5px', color: 'var(--primary)' }}>Get Key</a>
                    </p>
                    <div className="form-group">
                        <label>Gemini API Key</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="password"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                placeholder="Paste your API key here"
                                style={{ flex: 1 }}
                            />
                            <button className="secondary" onClick={handleSaveKey}>Save</button>
                        </div>
                    </div>
                </div>


                <div className="card">
                    <h2>Google Integration</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Connect your account to sync study plans with Google Calendar and Tasks.
                    </p>
                    {!googleConnected ? (
                        <button className="secondary" onClick={handleGoogleConnect} disabled={connecting}>
                            {connecting ? "Connecting..." : "Connect Google Account"}
                        </button>
                    ) : (
                        <div style={{ marginTop: '10px', color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={16} /> Connected to user@example.com
                        </div>
                    )}
                </div>



                <div className="card">
                    <h2>System Preferences</h2>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <label style={{ margin: 0 }}>Dark Mode (Coming Soon)</label>
                        <div style={{ width: '40px', height: '20px', background: '#ddd', borderRadius: '20px', position: 'relative' }}>
                            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ margin: 0 }}>Hard Mode (AI Adaptation)</label>
                        <div style={{ width: '40px', height: '20px', background: 'var(--primary)', borderRadius: '20px', position: 'relative' }}>
                            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
