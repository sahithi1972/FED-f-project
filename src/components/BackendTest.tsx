import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface TestRecipe {
    name: string;
    ingredients: string[];
    instructions: string[];
}

export const BackendTest = () => {
    const [message, setMessage] = useState('Testing backend connection...');
    const [recipe, setRecipe] = useState<TestRecipe | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Test basic connection
        fetch(`${API_BASE_URL}/hello`)
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => setError('Failed to connect to backend: ' + err.message));

        // Test recipe endpoint
        fetch(`${API_BASE_URL}/test-recipe`)
            .then(res => res.json())
            .then(data => setRecipe(data.recipe))
            .catch(err => console.error('Failed to fetch recipe:', err));
    }, []);

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm space-y-2">
            <div>
                {error ? (
                    <span className="text-red-400">{error}</span>
                ) : (
                    <span className="text-green-400">{message}</span>
                )}
            </div>
            
            {recipe && (
                <div className="border-t border-white/20 pt-2">
                    <div className="font-bold">{recipe.name}</div>
                    <div className="text-xs opacity-80">
                        Ingredients: {recipe.ingredients.join(', ')}
                    </div>
                </div>
            )}
        </div>
    );
}