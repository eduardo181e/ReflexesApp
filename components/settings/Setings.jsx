import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

import { LanguageContext } from '../../contexts/LanguageContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import translations from '../../contexts/translations';
import { darkTheme, lightTheme } from '../../contexts/Styles';

const Settings = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const options = ['English', 'Español'];
  const options1 = ['Dark', 'Light'];
  const options1L = ['Oscuro', 'Claro'];
  const { language, changeLanguage } = useContext(LanguageContext);
  const [selectedOption, setSelectedOption] = useState(language === 'en' ? 'English' : 'Español');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;
  const [selectedOption1, setSelectedOption1] = useState();
  const trans = translations[language].settings
  useEffect
  useEffect(() => {
      if (language === 'en'){
        if(theme === 'Dark'){
          setSelectedOption1('Dark');
        }else{
          setSelectedOption1('Light');
        }
      }else{
        if(theme === 'Dark'){
          setSelectedOption1('Oscuro');
        }else{
          setSelectedOption1('Claro')
        }
      }
    
  }, [selectedOption]);

  

  return (
      <View style={[styles.container, currentTheme.container]}>
        <Text style={[styles.label, currentTheme.text]}>{trans.lang}</Text>
        <TouchableOpacity
          style={[styles.selector, currentTheme.container]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.text, currentTheme.text]}>{selectedOption}</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={[styles.modalContainer, currentTheme.container, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, currentTheme.container]}
                  onPress={() => {
                    setSelectedOption(item);
                    setModalVisible(false);
                    if(item === 'English'){
                      changeLanguage('en')
                    }else{
                      changeLanguage('es')
                    }
                  }}
                >
                  <Text style={[styles.optionText, currentTheme.text]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, currentTheme.text]}>Close</Text>
            </TouchableOpacity>
          </View>


        </Modal>
          <Text style={[styles.label, currentTheme.text]}>{trans.theme}</Text>
          <TouchableOpacity
            style={[styles.selector]}
            onPress={() => setModalVisible1(true)}
          >
            <Text style={[styles.text, currentTheme.text]}>{selectedOption1}</Text>
          </TouchableOpacity>
          <Modal visible={isModalVisible1} transparent animationType="slide">
          <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
            <FlatList
              data={language === 'en' ? options1 : options1L}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, currentTheme.container]}
                  onPress={() => {
                    setSelectedOption1(item);
                    setModalVisible1(false);
                    if(item === "Dark" || item === "Oscuro"){
                      toggleTheme("Dark");
                    }else{
                      toggleTheme("Light");
                    }
                  }}
                >
                  <Text style={[styles.optionText, currentTheme.text]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: selectedOption1 === 'Dark' || 'Oscuro' ? '#ff5555' : '#ff4444' }]}
              onPress={() => setModalVisible1(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>


        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  option: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ff5555',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Settings;
