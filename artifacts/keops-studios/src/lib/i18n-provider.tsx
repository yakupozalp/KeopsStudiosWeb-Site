import { createContext, useContext, useEffect, useState } from "react";

type Language = "tr" | "en";

type I18nProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type I18nProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (trText: string | null | undefined, enText: string | null | undefined, fallback?: string) => string;
};

const initialState: I18nProviderState = {
  language: "tr",
  setLanguage: () => null,
  t: () => "",
};

const I18nProviderContext = createContext<I18nProviderState>(initialState);

export function I18nProvider({
  children,
  defaultLanguage = "tr",
  storageKey = "keops-lang",
  ...props
}: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  const value = {
    language,
    setLanguage: (lang: Language) => {
      localStorage.setItem(storageKey, lang);
      setLanguage(lang);
    },
    t: (trText: string | null | undefined, enText: string | null | undefined, fallback: string = "") => {
      if (language === "en" && enText) return enText;
      if (language === "tr" && trText) return trText;
      return trText || enText || fallback;
    }
  };

  return (
    <I18nProviderContext.Provider {...props} value={value}>
      {children}
    </I18nProviderContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nProviderContext);

  if (context === undefined)
    throw new Error("useI18n must be used within a I18nProvider");

  return context;
};
