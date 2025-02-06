import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../../contexts/Styles';
import translations from '../../../contexts/translations';

const showAlert = (message) => {
  
  Alert.alert(
    'Alert',
    message,
    [
      { text: 'OK', onPress: () => console.log('OK button pressed') }
    ],
  );
};


const Alert1 = ({ visible, message, extraParam, onClose, onConfirm }) => {
  const [inputValue1, setInputValue1] = React.useState(0);
  const [inputValue2, setInputValue2] = React.useState(0);
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const trans = translations[language].button
  const trans1 = translations[language].submenu
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;
  if (!visible) {
    return null;
  }

  const handleConfirm = () => {
    if(parseInt(inputValue1) < 20){
      showAlert(trans1.exedTime)
    }else{
    const inputs = {
      duration: inputValue1 === '' ? '0' : inputValue1,
      delay: inputValue2 === '' ? '0' : inputValue2,
    };
    onConfirm(inputs);
    setInputValue1(0)
    setInputValue2(0)
  }
  };

  const close = () => {
    onClose()
    setInputValue1(0)
    setInputValue2(0)
  }



  return (
    <View style={styles.alertContainer}>
      <View style={[styles.alertBox, currentTheme.container]}>
        <Text style={[{ fontSize: 20, marginBottom: 10}, , currentTheme.text]}>{extraParam}</Text>
        <Text style={[{ fontSize: 16, textAlign: 'center', marginBottom: 10}, , currentTheme.text]}>{trans1.duration}</Text>
        <View style={{ flexDirection: 'row'}}>
                <TextInput 
          style={[styles.input, currentTheme.text]} 
          value={inputValue1} 
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setInputValue1(numericText);
          }}
          placeholder={trans1.time}
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
        <Text style={[{ marginLeft: 10, paddingTop: 30, fontSize: 16}, currentTheme.text]}>ms</Text>  
        </View>

        <Text style={[{ fontSize: 15, textAlign: 'center', fontSize: 16, marginBottom: 10}, , currentTheme.text]}>{trans1.delay}</Text>
        <View style={{ flexDirection: 'row'}}><TextInput 
          style={[styles.input, currentTheme.text]} 
          value={inputValue2} 
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setInputValue2(numericText);
          }}
          placeholder={trans1.time}
          placeholderTextColor="#888"
          keyboardType="numeric"
        /><Text style={[{ marginLeft: 10, paddingTop: 30}, currentTheme.text]}>ms</Text>
          </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button]} onPress={close}>
        <Text style={currentTheme.text}>{trans.close}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button]} onPress={handleConfirm}>
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
    zIndex: 4
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

export default Alert1;
