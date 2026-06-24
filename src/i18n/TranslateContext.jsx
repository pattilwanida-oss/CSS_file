import React, { createContext, useContext, useState, useCallback } from 'react';
import locales from './locales';

const TranslateContext = createContext();

export function TranslateProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = useCallback(
    (key) => {
      if (lang === 'en') return key;
      return locales[lang]?.[key] || key;
    },
    [lang]
  );

  return (
    <TranslateContext.Provider value={{ t, lang, setLang }}>
      {children}
    </TranslateContext.Provider>
  );
}

export function useTranslate() {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
}
