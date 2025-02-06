import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Button, ScrollView } from 'react-native'; // Importa TouchableOpacity para una posible interacción
import { StyleSheet } from 'react-native';
import Alert1 from './SpeedPunch';
import Alert2 from './SpeedPunchEdit';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../../contexts/Styles';
import translations from '../../../contexts/translations';

const styles = StyleSheet.create({
  convBox: {
    // Agrega estilos para la clase 'convBox' aquí, por ejemplo,
    flexDirection: 'row', // Organiza los elementos en una fila
    flexWrap: 'wrap', // Permite que los elementos se ajusten a varias líneas
    padding: 10, // Agrega relleno para el espaciado
    width: '100%',
    marginBottom: 20
  },
  convBoxVar: {
    // Agrega estilos para la clase 'convBox' aquí, por ejemplo,
    flexDirection: 'column', // Organiza los elementos en una fila
    flexWrap: 'wrap', // Permite que los elementos se ajusten a varias líneas
    padding: 10, // Agrega relleno para el espaciado
    width: '100%',
    
  },

  name: {
    // Agrega estilos para la clase 'convBox' aquí, por ejemplo,
    flexDirection: 'column', // Organiza los elementos en una fila
    flexWrap: 'wrap', // Permite que los elementos se ajusten a varias líneas
    padding: 10, // Agrega relleno para el espaciado
    width: '100%',
    marginBottom: -20,
    color: 'black'
    
  },
  convBoxVarInput: {
    width: '100%',
    color: 'black',
    padding: 16, 
    borderWidth: 1,
    fontSize: 16, 
    borderRadius: 12, 
    marginBottom: 10, 
    shadowColor: '#000', 
    borderColor: '#ccc',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4
  },
  convItem: {
    padding: 16, 
    borderWidth: 1, 
    borderRadius: 12, 
    marginBottom: 10, 
    shadowColor: '#000', 
    borderColor: '#ccc',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    flex: 1,
    flexBasis: 100,
    margin: 3
  },

  convItemSave: {
    width: '50%',
    marginLeft: '25%',
    borderWidth: 1, 
    color: 'black',
    padding: 16, 
    borderWidth: 1, 
    borderRadius: 12, 
    marginBottom: 10, 
    shadowColor: '#000', 
    borderColor: '#ccc',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4
  },

  convItemLine: {
    padding: 16, 
    borderWidth: 1, 
    shadowColor: '#000', 
    borderColor: '#ccc',
    borderRadius: 12, 
    marginBottom: 10, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    margin: 3
  }

});
const showAlert = (message) => {
  Alert.alert(
    'Alert',
    message,
    [
      { text: 'OK', onPress: () => console.log('OK button pressed') }
    ],
  );
};


const SelectConvBox = ({ navigation }) => {
  const [name, setName] = useState('')
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible1, setAlertVisible1] = useState(false);
  const [extraParam, setExtraParam] = useState('');
  const [extraParam1, setExtraParam1] = useState('');
  const [duration1, setDuration] = useState('');
  const [delay1, setDelay] = useState('');
  const [id, setId] = useState(0);
  const [convinacion, setConvinacion] = useState([])
  const [delay, setDelayP] = useState(0)
  const [repetitions, setrepetitions] = useState(0)
  const scrollRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const trans = translations[language].make
  const trans1 = translations[language].Alert
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;

  const cicle = {
    delay: 0,
    repetitions: 0,
    convinacion: [],
    name: ''
  }

  const save = async () => {
    if(convinacion.length === 0){
      showAlert(trans1.errorLenght);
    }else if (name.trim() === '') {
      showAlert(trans1.errorVoid);
      return;
    } else if (repetitions === 0 || repetitions.trim().length === 0) {
      showAlert(trans1.errorRepeats);
    } else if (delay === 0 || delay === undefined) {
      setDelayP(0)
      const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/box/arrays/`;
      const filePath = `${dirPath + name.trim()}`;

      const dirInfo = await FileStorageModule.fileExists(filePath);
      if (dirInfo) {
        showAlert(trans1.errorExist1, trans1.errorExist2 + name.trim() + trans1.errorExist3);
      } else {
        await createAndStoreArray();
        showAlert(trans1.suucesSave);
        navigation.navigate('ListBox');
      }

    } else {

      const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/box/arrays/`;
      const filePath = `${dirPath + name.trim()}`;

      const dirInfo = await FileStorageModule.fileExists(filePath);
      if (dirInfo) {
        showAlert(trans1.errorExist1, trans1.errorExist2 + name.trim() + trans1.errorExist3);
      } else {
        await createAndStoreArray();
        showAlert(trans1.suucesSave);
        navigation.navigate('ListBox');
      }

    }
    console.log(convinacion)
  }

  const createAndStoreArray = async () => {
    const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/box/arrays/`;
    const filePath = `${dirPath+name.trim()}`;
  
    // Crear la carpeta si no existe
    const dirInfo = await FileStorageModule.fileExists(dirPath);
    if (!dirInfo) {
      await FileStorageModule.createDirectory(dirPath);
    }
  
    // Escribir el array en el archivo
    cicle.delay = delay
    cicle.convinacion = convinacion
    cicle.repetitions = repetitions
    console.log(cicle)
    const jsonString = JSON.stringify(cicle)
    await FileStorageModule.writeFile(filePath, jsonString);
    console.log('Archivo creado y array almacenado en:', filePath);
  };

  const savePlay = async () => {

    if(convinacion.length === 0){
      showAlert(trans1.errorLenght);
    }else if (name.trim() === '') {
      showAlert(trans1.errorVoid);
      return;
    }else if (repetitions === 0 || repetitions.trim().length === 0) {
      showAlert(trans1.errorRepeats);
    } else if (delay === 0 || delay === undefined) {
      setDelayP(0)
      const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/box/arrays/`;
      const filePath = `${dirPath + name.trim()}`;
      
      const dirInfo = await FileStorageModule.fileExists(filePath);
    if (dirInfo) {
      showAlert(trans1.errorExist1, trans1.errorExist2 + name.trim()+ trans1.errorExist3);
    } else {
      await createAndStoreArray();
      showAlert(trans1.suucesSave);
      navigation.navigate('PlayBox', { name: name.trim()});
    }

      }else{
        const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/box/arrays/`;
        const filePath = `${dirPath + name.trim()}`;
        
        const dirInfo = await FileStorageModule.fileExists(filePath);
      if (dirInfo) {
        showAlert(trans1.errorExist1, trans1.errorExist2 + name.trim()+ trans1.errorExist3);
      } else {
        await createAndStoreArray();
        showAlert(trans1.suucesSave);
        navigation.navigate('PlayBox', { name: name.trim()});
      }

    }
    console.log(convinacion)
  }

  const toggleAlert = (param = '') => {
    setExtraParam(param);
    setAlertVisible(prev => !prev);
  };

  const findObjectById = (id) => {
    return convinacion.find(item => item.id === id);
  };

  const toggleAlert1 = (param = '') => {
    const id = findObjectById(param)
    console.log(id)
    setId(id.id);
    setExtraParam1(id.punch);
    setDuration(id.duration);
    setDelay(id.delay);
    setAlertVisible1(prev => !prev);
  };

  const handleConfirm1 = (inputValues) => {
    const jsonObject = {
      ...inputValues,
      punch: extraParam1,
      id: id
    };
    const nuevoConvinacion = convinacion.map(item => {
      if (item.id === id) {
        return jsonObject;
      }
      return item;
    });
    setConvinacion(nuevoConvinacion)
    console.log(inputValues.id)
    setAlertVisible1(false);
  };

  const handleConfirm = (inputValues) => {
    const newId = convinacion.length > 0 ? Math.max(...convinacion.map(item => item.id)) + 1 : 0; // Asegura que el ID sea único y positivo
    const jsonObject = {
        id: newId,
        punch: extraParam,
        ...inputValues,
    };
    const updatedConvinacion = [...convinacion, jsonObject]; 
    
    // Si convinacion es un state, lo actualizas con set
    setConvinacion(updatedConvinacion);
    console.log(jsonObject);
    console.log(convinacion);
    setAlertVisible(false);
};
  

  const handleDelete = () => {
    const newItems = convinacion.filter(item => item.id !== id);
    setConvinacion(newItems);
    // Lógica para eliminar el elemento
    console.log(`Deleting item with id: ${id}`);
    setAlertVisible1(false);
  };
  const convOptions = [
    'Jab',
    'Cross',
    'Crochet L',
    'Crochet R',
    'Uppercut L',
    'Uppercut R',
    'Gancho L',
    'Gancho R',
    'Jav Body',
    'Cross Body',
  ]; // Matriz de opciones para mayor comodidad

  const ListItem = ({ item, drag }) => (
    <View key={item.id.toString()} style={styles.itemContainer}>
      <TouchableOpacity
        onLongPress={drag}
        onPress={() => toggleAlert1(item.id)}
        style={styles.convItemLine}
      >
        <Text style={[{ height: 20 }, currentTheme.text]}>{item.punch}</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDragEnd = ({ data }) => {
    setConvinacion([...data]);
    console.log(data); 
    setIsDragging(false);

  };


  return (
    <ScrollView scrollEnabled={!isDragging} contentContainerStyle={[{ flexGrow: 1, justifyContent: 'center'}, currentTheme.container]}>
<View style={{width: '100%', zIndex: 1}}>
<Alert1
        visible={alertVisible}
        extraParam={extraParam}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleConfirm}
      />

<Alert2
        visible={alertVisible1}
        extraParam={extraParam1}
        duration={duration1}
        delay={delay1}
        id={id}
        onClose={() => setAlertVisible1(false)}
        onConfirm={handleConfirm1}
        onDelete={handleDelete}
      />
      

  <View style={styles.convBox}>
    {convOptions.map((option) => (
      <TouchableOpacity key={option} onPress={() => toggleAlert(option)} style={styles.convItem}>
        <Text style={[{ textAlign: 'center' }, currentTheme.text]}>{option}</Text>
      </TouchableOpacity>
    ))}
  </View>
  <View style={{marginBottom: 20}}>
      <View style={styles.convBoxVar}>
    <Text style={[{ paddingBottom: 5, fontSize: 16}, currentTheme.text]}>{trans.delay}</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
             <TextInput
        style={[styles.convBoxVarInput, currentTheme.text]}
        keyboardType="numeric"
        value={delay}
        onChangeText={(texto) => {
          const numericText = texto.replace(/[^0-9]/g, '');
          setDelayP(numericText)
        }}
      /> 
      </View>
      <Text style={[{ fontSize: 20, paddingTop: 20}, currentTheme.text]}>S</Text>
    </View>
  </View>
  <View style={styles.convBoxVar}>
    <Text style={[{ paddingBottom: 5, fontSize: 16}, currentTheme.text]}>{trans.repeats}</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
             <TextInput
        style={[styles.convBoxVarInput, currentTheme.text]}
        keyboardType="numeric"
        value={repetitions}
        onChangeText={(texto) => {
          const numericText = texto.replace(/[^0-9]/g, '');
          setrepetitions(numericText)
        }}
      /> 
      </View>
    </View>
  </View>
  <View style={styles.convBoxVar}>
    <Text style={[{ paddingBottom: 5, fontSize: 16 }, currentTheme.text]}>{trans.name}</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
             <TextInput
        style={[styles.convBoxVarInput, currentTheme.text]}
        value={name}
        onChangeText={(texto) => setName(texto)}
      /> 
      </View>
    </View>
  </View>
  </View>

  <View>
    <View style={{marginBottom: 20}}>
    {convinacion.length > 0 && (
        <View>
          <Text style={[{ padding: 10, fontSize: 20 }, currentTheme.text]}>{trans.time}</Text>
        </View>
      )}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DraggableFlatList
          data={convinacion}
          renderItem={({ item, drag }) => <ListItem item={item} drag={drag} />}
          keyExtractor={(item) => item.id.toString()}
          onDragBegin={() => { setIsDragging(true)}}
          onDragEnd={handleDragEnd}
          horizontal={true}
        />
      </GestureHandlerRootView>
    </View>

    <View>
    <TouchableOpacity key={'guardaryCom'} style={styles.convItemSave}>
        <Text style={[{textAlign: 'center'}, currentTheme.text]} onPress={savePlay}>{trans.saveCont}</Text>
      </TouchableOpacity>
      <TouchableOpacity key={'guardar'} style={styles.convItemSave}>
        <Text style={[{textAlign: 'center'}, currentTheme.text]} onPress={save}>{trans.save}</Text>
      </TouchableOpacity>
    </View>

  </View>
  <View>
    </View>
</View></ScrollView>


  );
};

export default SelectConvBox;