import { useState, useEffect } from 'react';

export const BackendTest = () => {
    const [message, setMessage] = useState('Testing backend connection...');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/hello')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => setError('Failed to connect to backend: ' + err.message));
    }, []);

    // This won't affect your existing UI - it's just a small floating indicator
    return (
        <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm">
            {error ? (
                <span className="text-red-400">{error}</span>
            ) : (
                <span className="text-green-400">{message}</span>
            )}
        </div>
    );
}