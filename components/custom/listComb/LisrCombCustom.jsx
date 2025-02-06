import React, { useContext, useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;
import Alert3 from './NameCopy';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../../contexts/Styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import translations from '../../../contexts/translations';
import Alert4 from './Delete';

const ListStoredItemsCustom = ({ navigation }) => {
  const [storedItemKeys, setStoredItemKeys] = useState([]);
  const dirPath = `/custom/arrays/`;
  const dirPathSound = `/custom/sound/`;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible1, setAlertVisible1] = useState(false);
  const [name, setName] = useState('');
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;
  const [ delete1, setDelete] = useState('');

  useEffect(() => {
    const fetchStoredItemKeys = async () => {
      try {
        nameDir = await FileStorageModule.getDocumentDirectoryPath() + dirPath
        FileStorageModule.readDirectory(nameDir)
        .then(fileNames => {
          const keys = fileNames.map(file => file);
          setStoredItemKeys(keys);
        })
        .catch(error => {
          console.error(error);
        });
      } catch (error) {
        console.error('Error fetching stored item keys:', error);
      }
    };

    fetchStoredItemKeys();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
        const fetchStoredItemKeys = async () => {
            try {
              nameDir = await FileStorageModule.getDocumentDirectoryPath() + dirPath
              FileStorageModule.readDirectory(nameDir)
              .then(fileNames => {
                const keys = fileNames.map(file => file);
                setStoredItemKeys(keys);
              })
              .catch(error => {
                console.error(error);
              });
            } catch (error) {
              console.error('Error fetching stored item keys:', error);
            }
          };
      
          fetchStoredItemKeys();
    }, [])
  );

  const deleteFile = async (name) => {
    try {
      await FileStorageModule.deleteFile(await FileStorageModule.getDocumentDirectoryPath() + dirPath + name);
      await FileStorageModule.deleteDirectory(await FileStorageModule.getDocumentDirectoryPath() + dirPathSound + name);
      const indexToRemove = storedItemKeys.findIndex(item => item === name);
      console.log(indexToRemove)
      const updatedItems = [...storedItemKeys]; 
        updatedItems.splice(indexToRemove, 1); // Eliminar el elemento en el índice especificado
        setStoredItemKeys(updatedItems); // Actualizar el estado con el nuevo array
      
      console.log(storedItemKeys)
    } catch (error) {
      console.error(error);
    }
  };

  const showAlert = (message) => {
  
    Alert.alert(
      'Alert Title',
      message,
      [
        { text: 'OK', onPress: () => console.log('OK button pressed') }
      ],
    );
  };

  const copyFile = async (name, newName) => {

    if(newName === ''){
      showAlert('Por favor ingresa el nombre de tu copia');
    }else{   
      // Para el array
      const dirPath1 = await FileStorageModule.getDocumentDirectoryPath() + dirPath;
      const filePath = `${dirPath1 + newName.trim()}`;
      const filePath1 = `${dirPath1 + name.trim()}`;
      // Para los audios
      const dirPath2 = await FileStorageModule.getDocumentDirectoryPath() + dirPathSound;
      const filePath2 = `${dirPath2 + newName.trim()}`;
      const filePath3 = `${dirPath2 + name.trim()}`;
    try {
      const dirInfo = await FileStorageModule.fileExists(filePath);
      const dirInfo1 = await FileStorageModule.fileExists(filePath2);
    if (dirInfo || dirInfo1) {
      showAlert('Archivo existente', `El archivo "${name.trim()}" ya existe.`);
    } else {
      await FileStorageModule.copyFileOrDirectory(filePath1, dirPath1, newName);
      await FileStorageModule.copyFileOrDirectory(filePath3, dirPath2, newName);
      const updatedItems = [...storedItemKeys]; 
        updatedItems.push(newName); // Eliminar el elemento en el índice especificado
        setStoredItemKeys(updatedItems); // Actualizar el estado con el nuevo array
      
      console.log(storedItemKeys)
      setAlertVisible(false);
    }
  } catch (error) {
    console.error(error)
  }
  }

}

  const toggleAlert = (name) => {
    setName(name);
    setAlertVisible(prev => !prev);
  };

  const toggleAlert1 = (name) => {
    setDelete(name);
    setAlertVisible1(prev => !prev);
  };


  const handleConfirm = async (inputValues) => {
    copyFile(name, inputValues)
  };

  const handleConfirm1 = async () => {
    deleteFile(delete1)
    setAlertVisible1(false)
  };


  const navigateToItem = async (itemName) => {
    // Aquí puedes hacer la lógica de navegación usando el nombre del archivo, por ejemplo:
    navigation.navigate('PlayCustom', { name: itemName});
  };

  const screenHeight = Dimensions.get('window').height;
  return (
    <View style={[{ height: screenHeight}, currentTheme.container]}>
      <TouchableOpacity 
        style={{
          borderWidth: 0, 
          borderRadius: 12, 
          marginBottom: 20, 
          backgroundColor: '#2196F3',
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: 0.2, 
          shadowRadius: 5,
          position: 'absolute',
          height: 60,
          width: 60,
          zIndex: 2,
          right: 16,
          bottom: 50
        
        }} 
        onPress={() => {
          navigation.navigate('selectCustom');
        }}>
          <Icon name="add" size={35} color="#000" style={{position: 'absolute', left: 13, top: 13}}/>
      </TouchableOpacity>      
      <Alert3
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleConfirm}
      />
      <Alert4
        visible={alertVisible1}
        onClose={() => setAlertVisible1(false)}
        onConfirm={handleConfirm1}
      />
    <ScrollView contentContainerStyle={[{ paddingBottom: 150, padding: 16, zIndex: 1 }, currentTheme.container]}>


      <Text style={[{ color: 'black', fontSize: 15, marginBottom: 10, padding: 10 }, currentTheme.text]}>
      {translations[language].list}
      </Text>

      {storedItemKeys.map((key) => (
        <TouchableOpacity 
          key={key} 
          onPress={() => navigateToItem(key)} 
          style={{
            padding: 16, 
            borderWidth: 1, 
            borderRadius: 12, 
            marginBottom: 10, 
            shadowColor: '#000', 
            borderColor: '#ccc',
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 4
          }}>
          <Text style={[{ color: 'black', fontSize: 16 }, currentTheme.text]}>
            {key}
          </Text>

          <TouchableOpacity
            onPress={() => toggleAlert(key)}
            style={{
              position: 'absolute',
              right: 95,
              top: 5,
              backgroundColor: '#4CAF50',
              borderRadius: 10,
              height: 45,
              width: 45,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={ require('../../../assets/copy.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleAlert1(key)}
            style={{
              position: 'absolute',
              right: 50,
              top: 5,
              backgroundColor: '#F44336',
              borderRadius: 10,
              height: 45,
              width: 45,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={ require('../../../assets/trash.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('editCustom', { name1: key })}
            style={{
              position: 'absolute',
              right: 5,
              top: 5,
              backgroundColor: '#2196F3',
              borderRadius: 10,
              height: 45,
              width: 45,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/edit-new-icon-22.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
};

export default ListStoredItemsCustom;

item = {padding: 10, borderWidth: 1, borderRadius: 10, marginBottom: 5}