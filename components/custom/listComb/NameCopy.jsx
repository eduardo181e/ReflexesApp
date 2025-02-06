import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../../contexts/Styles';
import translations from '../../../contexts/translations';
const Alert3 = ({ visible, onClose, onConfirm }) => {
  const [inputValue1, setInputValue1] = React.useState('');
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const trans = translations[language].button
  const trans1 = translations[language].submenu
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;
  if (!visible) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(inputValue1);
    setInputValue1('')
  };

  const close = () => {
    onClose()
    setInputValue1('')
  }

  return (
    <View style={styles.alertContainer}>
      <View style={[styles.alertBox, currentTheme.container]}>
        <Text style={[{ fontSize: 20, marginBottom: 10}, , currentTheme.text]}>{trans1.copy}</Text>
        <View style={{ flexDirection: 'row'}}>
                <TextInput 
          style={[styles.input, currentTheme.text]} 
          value={inputValue1} 
          onChangeText={setInputValue1} 
          placeholder={trans1.name}
          placeholderTextColor="#888"
        />
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={close}>
        <Text style={currentTheme.text}>{trans.close}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
            <Text style={currentTheme.text}>{trans.confirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 16,
    fontSize: 16, 
    borderWidth: 1, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderColor: '#ccc', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 16, 
    borderWidth: 1, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderColor: '#ccc', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4
  },
});
export default Alert3;
