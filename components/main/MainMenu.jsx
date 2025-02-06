import React, { useContext } from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import  translations  from '../../contexts/translations';
import { LanguageContext } from '../../contexts/LanguageContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../contexts/Styles';

const MainMenu = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;
  return (
    <View style={[styles.container, currentTheme.container]}>
      {/* Botón de configuración */}
      <TouchableOpacity
        style={[styles.settingsButton]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon name="settings" size={30} color={theme === 'Light' ? 'black' : 'white'} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Botones del menú */}
        <TouchableOpacity
          style={[styles.button, styles.borderBox]}
          onPress={() => navigation.navigate('ListBox')}
        >
          <Text style={[styles.text, currentTheme.text]}>{translations[language].main.box}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.borderCustom]}
          onPress={() => navigation.navigate('ListCustom')}
        >
          <Text style={[styles.text, currentTheme.text]}>{translations[language].main.custom}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    alignItems: 'center',
    flexGrow: 1, // Esto asegura que el contenido ocupe todo el espacio disponible
    marginTop: 35
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10, // Asegura que el botón esté sobre otros elementos
  },
  button: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
  },
});

export default MainMenu;