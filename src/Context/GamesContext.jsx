import { createContext, useContext, useState, useEffect } from 'react';
import sampleGames from '../data/games';

const GamesContext = createContext();

export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const loadGames = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGames(sampleGames);
      setLoading(false);
    };

    loadGames();
  }, []);

  const contextValue = {
    games,
    loading,
    setGames
  };

  return (
    <GamesContext.Provider value={contextValue}>
      {children}
    </GamesContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
};

export default GamesContext;
