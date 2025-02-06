import React, { createContext, useState, useEffect, useMemo } from 'react';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('Dark');

  useEffect(() => {
    const initializeTheme = async () => {
      const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/context/`;
      const filePath = `${dirPath}Theme`;

      const dirInfo = await FileStorageModule.fileExists(dirPath);
      if (!dirInfo) {
        await FileStorageModule.createDirectory(dirPath);
        await FileStorageModule.writeFile(filePath, 'Dark');
        console.log('Archivo creado y tema almacenado en:', filePath);
        setTheme('Dark');
      } else {
        const storedTheme = await FileStorageModule.readFile(filePath);
        setTheme(storedTheme);
      }
    };

    initializeTheme();
  }, []);

  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/context/`;
    const filePath = `${dirPath}Theme`;
    await FileStorageModule.writeFile(filePath, newTheme);
    console.log('Tema actualizado y almacenado en:', filePath);
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
