import React, { useEffect, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;
import Alert3 from './NameCopy';

const ListStoredItemsCustom = ({ navigation }) => {
  const [storedItemKeys, setStoredItemKeys] = useState([]);
  const dirPath = `/custom/arrays/`;
  const dirPathSound = `/custom/sound/`;
  const [alertVisible, setAlertVisible] = useState(false);
  const [name, setName] = useState('');

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

  const handleConfirm = async (inputValues) => {
    copyFile(name, inputValues)
  };


  const navigateToItem = async (itemName) => {
    // Aquí puedes hacer la lógica de navegación usando el nombre del archivo, por ejemplo:
    navigation.navigate('PlayCustom', { name: itemName});
  };

  const screenHeight = Dimensions.get('window').height;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, height: screenHeight }}>
            <Alert3
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleConfirm}
      />
        <TouchableOpacity style={{padding: 10, borderWidth: 2, borderRadius: 10, marginBottom: 20}} onPress={() =>
            {
                navigation.navigate('selectCustom');
            }
            }>
            <Text style={{color: 'black'}}>
                Crear un nuevo combo
            </Text>
        </TouchableOpacity>
      <Text style={{color: 'black'}}>Stored Item Names</Text>
      {storedItemKeys.map((key) => (
        <TouchableOpacity key={key} onPress={() => navigateToItem(key)} style={item}>
          <Text style={{color: 'black'}}>{key}</Text>
          <TouchableOpacity
            onPress={() => toggleAlert(key)}
            style={{
              position: 'absolute',
              right: 80.5,
              top: 1,
              backgroundColor: 'green',
              borderRadius: 10,
              height: 39,
              paddingTop: 7,
              width: 40,
              paddingLeft: 8,
            }}>
            <Image
              source={ require('../../../assets/copy.png')}
              style={{ width: 30, height: 30, position: 'absolute', right: 4, top: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteFile(key)}
            style={{
              position: 'absolute',
              right: -0.2,
              top: 1,
              backgroundColor: 'red',
              borderRadius: 10,
              height: 39,
              paddingTop: 7,
              width: 40,
              paddingLeft: 8,
            }}>
            <Image
              source={ require('../../../assets/trash.png')}
              style={{ width: 30, height: 30, position: 'absolute', right: 4, top: 5 }}
            />
          </TouchableOpacity>

          {/* Botón para editar */}
          <TouchableOpacity
            onPress={() => navigation.navigate('editCustom', { name1: key })}
            style={{
              position: 'absolute',
              right: 40,
              top: 1,
              backgroundColor: 'blue',
              borderRadius: 10,
              height: 39,
              paddingTop: 7,
              width: 40,
              paddingLeft: 8,
            }}>
            <Image
              source={require('../../../assets/edit-new-icon-22.png')}
              style={{ width: 30, height: 30, position: 'absolute', right: 4, top: 5 }}
            />
          </TouchableOpacity>
          {/* <Icon onPress={() => deleteFile(key)} style={{position: 'absolute', right: -.2, top: 0, backgroundColor: 'red', borderRadius: 10, height: 39, paddingTop: 7, width: 40, paddingLeft: 8}} name="delete" size={24} color="black" />
          <Icon onPress={() =>             {
                navigation.navigate('editCustom', { name1: key });
            }} style={{position: 'absolute', right: 40, top: 0, backgroundColor: 'blue', borderRadius: 10, height: 39, paddingTop: 7, width: 40, paddingLeft: 8}} name="edit" size={24} color="white" /> */}
          
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ListStoredItemsCustom;

item = {padding: 10, borderWidth: 1, borderRadius: 10, marginBottom: 5}