'use client';

import * as Toast from '@radix-ui/react-toast';
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext({
  showToast: (title: string, description?: string) => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const showToast = useCallback((title: string, description = '') => {
    setTitle(title);
    setDescription(description);
    setOpen(false);
    setTimeout(() => setOpen(true), 10);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        <Toast.Root open={open} onOpenChange={setOpen} className="bg-black text-white rounded p-4 shadow-lg">
          <Toast.Title className="font-bold text-white">{title}</Toast.Title>
          <Toast.Description className="text-sm text-white mt-1">{description}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 w-96 z-50" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};
