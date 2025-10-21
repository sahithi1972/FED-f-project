import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthModal } from '../components/AuthModal';

type AuthMode = 'signin' | 'signup';

interface AuthModalContextType {
  openModal: (mode: AuthMode) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');

  const openModal = (selectedMode: AuthMode) => {
    setMode(selectedMode);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeModal} initialMode={mode} />
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};