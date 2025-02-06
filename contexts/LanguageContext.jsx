import React, { createContext, useState, useEffect, useMemo } from 'react';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const initializeLanguage = async () => {
        const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/context/`;
        const filePath = `${dirPath}Language`;

        const dirExists = await FileStorageModule.fileExists(dirPath);
        if (!dirExists) {
          await FileStorageModule.createDirectory(dirPath);
          await FileStorageModule.writeFile(filePath, 'en');
          console.log('Archivo de idioma creado en:', filePath);
          setLanguage('en');
        } else {
          const storedLanguage = await FileStorageModule.readFile(filePath);
          setLanguage(storedLanguage);
        }
    };

    initializeLanguage();
  }, []);

  const changeLanguage = async (newLanguage) => {
      setLanguage(newLanguage);
      const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/context/`;
      const filePath = `${dirPath}Language`;
      await FileStorageModule.writeFile(filePath, newLanguage);
      console.log('Idioma actualizado y almacenado en:', filePath);
  };

  const value = useMemo(() => ({ language, changeLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
