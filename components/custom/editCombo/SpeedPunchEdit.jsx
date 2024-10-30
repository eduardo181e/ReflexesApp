import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

const Alert2 = ({ visible, message, extraParam, onClose, onConfirm, duration, delay, onDelete, duration1 }) => {
  const [inputValue1, setInputValue1] = React.useState(0);
  const [inputValue2, setInputValue2] = React.useState(0);
  useEffect(() => {
    setInputValue1(duration);
    setInputValue2(delay);
  }, [duration,delay]);
  if (!visible) {
    return null;
  }

  const handleConfirm1 = () => {
    const inputs = {
      duration: inputValue1 === '' ? '0' : inputValue1,
      delay: inputValue2 === '' ? '0' : inputValue2,
    };
    onConfirm(inputs);
  };
  
  const handleDelete = () => {
    onDelete();
    setInputValue1(duration)
    setInputValue2(delay)
  };

  return (
    <View style={styles.alertContainer}>
      <View style={styles.alertBox}>
        <Text style={{ fontSize: 20, marginBottom: 10, color: 'black' }}>{extraParam}<Text>{'  '+duration1}</Text></Text>
        <Text style={{ fontSize: 15, textAlign: 'center', color: 'black' }}>Duracion de sonido</Text>
        <View style={{ flexDirection: 'row'}}>
                <TextInput 
          style={styles.input} 
          value={inputValue1} 
          onChangeText={setInputValue1} 
          placeholder="Tiempo"
          keyboardType="numeric"
        />
        <Text style={{ marginLeft: 10, paddingTop: 30, color: 'black'}}>ms</Text>  
        </View>

        <Text style={{ fontSize: 15, textAlign: 'center' , color: 'black'}}>Tiempo que tardara en aparecer el sonido desde el ultimo</Text>
        <View style={{ flexDirection: 'row'}}><TextInput 
          style={styles.input} 
          value={inputValue2} 
          onChangeText={setInputValue2} 
          placeholder="Tiempo"
          keyboardType="numeric"
        /><Text style={{ marginLeft: 10, paddingTop: 30, color: 'black'}}>ms</Text>
          </View>
        <View style={styles.buttonContainer}>
          <Button title="Close" onPress={() => {
                setInputValue1(duration)
                setInputValue2(delay)
onClose()
          }} />
          <Button title="Confirm" onPress={handleConfirm1} />
          <Button title="Delete" onPress={handleDelete} /> 
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

export default Alert2;
