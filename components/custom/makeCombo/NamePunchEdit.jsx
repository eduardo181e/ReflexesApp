import React from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

const Alert3 = ({ visible, onClose, onConfirm }) => {
  const [inputValue1, setInputValue1] = React.useState('');

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
      <View style={styles.alertBox}>
        <Text style={{ fontSize: 15, textAlign: 'center',color: 'black' }}>Nombre del Golpe</Text>
        <View style={{ flexDirection: 'row'}}>
                <TextInput 
          style={styles.input} 
          value={inputValue1} 
          onChangeText={setInputValue1} 
          placeholder="Nombre"
        />
        <Text style={{ marginLeft: 10, paddingTop: 30}}>ms</Text>  
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Close" onPress={close} />
          <Button title="Confirm" onPress={handleConfirm} />
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    width: '80%',
    paddingHorizontal: 10,
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Alert3;
