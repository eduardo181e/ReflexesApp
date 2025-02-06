import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Button, ScrollView, Dimensions, PermissionsAndroid } from 'react-native'; // Importa TouchableOpacity para una posible interacción
import { StyleSheet } from 'react-native';
import Alert1 from './SpeedPunch';
import Alert2 from './SpeedPunchEdit';
import Alert3 from './NamePunchEdit';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;
const { AudioModule } = NativeModules;
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../../contexts/Styles';
import translations from '../../../contexts/translations';
const showAlert = (message) => {
  
  Alert.alert(
    'Alert Title',
    message,
    [
      { text: 'OK', onPress: () => console.log('OK button pressed') }
    ],
  );
};

export default function SelectConvCustomEdit({navigation, route}) {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [punch, setPunch] = React.useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisible1, setAlertVisible1] = useState(false);
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [extraParam, setExtraParam] = useState('');
  const [extraParam1, setExtraParam1] = useState('');
  const [duration1, setDuration] = useState('');
  const [delay1, setDelay] = useState('');
  const [id, setId] = useState(0);
  const [convinacion, setConvinacion] = useState([])
  const [delay, setDelayP] = useState(0)
  const [repetitions, setrepetitions] = useState(0)
  const [duration2, setDuration2] = useState(0);
  const dirPath = `/custom/arrays/`;
  const dirPathSound = `/custom/sound/`;
  const { name1 } = route.params;
  const [isDragging, setIsDragging] = useState(false);
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;
  const trans = translations[language].make
  const trans1 = translations[language].Alert

  const cicle = {
    delay: 0,
    repetitions: 0,
    convinacion: []
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        

         const fetchSounds = async () => {
          const keys = await FileStorageModule.readDirectory(await FileStorageModule.getDocumentDirectoryPath()+dirPathSound + name1);
          console.log(keys)
          const sounds1 = [];
    
          for (const e of keys) {
            const o = await FileStorageModule.getDocumentDirectoryPath()+dirPathSound + name1

            const filePath = o +'/'+ e
            console.log(filePath)
            const durationMillis = await AudioModule.getAudioDuration(filePath);

            console.log(durationMillis);
            const punch = {
              duration: getDurationFormatted(durationMillis),
              file: filePath,
              name: e.replace('.m4a', ''),
            };
            
      
            sounds1.push(punch);
          }
    
          setRecordings(sounds1);
        };

        fetchSounds();
        const filePath = `${await FileStorageModule.getDocumentDirectoryPath() + dirPath}${name1}`;
        const content = await FileStorageModule.readFile(filePath);
        const retrievedCombo1 = JSON.parse(content);

        setConvinacion(retrievedCombo1.convinacion);
        setDelayP(retrievedCombo1.delay);
        setrepetitions(retrievedCombo1.repetitions);
      } catch (error) {
        console.error('Error leyendo el archivo:', error);
      }
    };

    fetchData();
  }, [dirPath, name1]);

  useFocusEffect(
    useCallback(() => {
  
      return async () => {
        await createAndStoreArray();
        console.log('ScreenA desenfocada');
        if(recording){
          await AudioModule.stopRecording();
        }
      };
    }, [name1, delay, convinacion, repetitions, recording]) 
  );


  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };


  const startRecording = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        console.error('Microphone permission denied');
        return;
      }
    }
    try {
      const message = await AudioModule.startRecording();
      console.log(message); // 'Recording started'
      setRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };



  const save = async() => {
    if(convinacion.length === 0){
      showAlert(trans1.errorLenght);
    }else if (repetitions === 0 || repetitions.trim().length === 0) {
      showAlert(trans1.errorRepeats);
    } else if (delay === 0 || delay === undefined) {
      setDelayP(0)
      await createAndStoreArray();
      showAlert(trans1.suucesSave);
      navigation.navigate('ListCustom');
      }else{

        await createAndStoreArray();
        showAlert(trans1.suucesSave);
        navigation.navigate('ListCustom');

  }
}

  const savePlay = async () => {
    if(convinacion.length === 0){
      showAlert(trans1.errorLenght);
    }else if (repetitions === 0 || repetitions.trim().length === 0) {
      showAlert(trans1.errorRepeats);
    } else if (delay === 0 || delay === undefined) {
      setDelayP(0)
      await createAndStoreArray();
      showAlert(trans1.suucesSave);
      navigation.navigate('PlayCustom', { name: name1.trim() });
      }else{
     

        await createAndStoreArray();
        showAlert(trans1.suucesSave);
        navigation.navigate('PlayCustom', { name: name1.trim() });
    }

    console.log(recordings)
    console.log(cacheDirectory)
    console.log(convinacion),
    console.log(recordings)
  }

  const createAndStoreArray = async () => {
    const filePath = `${await FileStorageModule.getDocumentDirectoryPath() + dirPath+name1.trim()}`;
  
    // Escribir el array en el archivo
    cicle.delay = delay
    cicle.convinacion = convinacion
    cicle.repetitions = repetitions
    console.log(cicle)
    const jsonString = JSON.stringify(cicle)
    await FileStorageModule.writeFile(filePath, jsonString);
    console.log('Archivo actualizado en:', filePath);
  };

  const toggleAlert = (param = '', duration) => {
    setDuration2(duration)
    setExtraParam(param);
    setAlertVisible(prev => !prev);
  };

  const findObjectById = (id) => {
    return convinacion.find(item => item.id === id);
  };

  const returnDuration = (name) => {
   const obj = recordings.find(item => item.name === name);
   return obj.duration
  };

  const toggleAlert1 = (param = '') => {
    const id = findObjectById(param)
    const duration = returnDuration(id.punch)
    setDuration2(duration)
    console.log(id)
    setId(id.id);
    setExtraParam1(id.punch);
    setDuration(id.duration);
    setDelay(id.delay);
    setAlertVisible1(prev => !prev);
  };

  const toggleAlert2 = () => {
    setAlertVisible2(prev => !prev);
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
const handleConfirm2 = async (inputValues) => {
  if(inputValues === ''){
    showAlert(trans1.errorVoidSound)
  }else{
  try {
    // Verifica si ya existe un archivo con el mismo nombre
    const existingRecording = recordings.find(recording => recording.name === inputValues);

    if (existingRecording) {
      showAlert(trans1.errorExistSound)
      return;
    }else{
    // Realiza el cambio de nombre del archivo
    const newPath = await changeFileName(punch.file, inputValues);

    if (newPath) {
      console.log('Nueva ruta del archivo:', newPath);

      // Agrega el nuevo objeto al array recordings
      const newRecording = {
        name: inputValues,
        file: newPath,
        duration: punch.duration
      };
      setRecordings(prevRecordings => [...prevRecordings, newRecording]);
      setAlertVisible2(false);
    } else {
      console.log('No se pudo renombrar el archivo.');
    }
  }
  } catch (error) {
    console.error('Error:', error);
  }
}
};

const changeFileName = async (oldUri, newFileName) => {
  try {
   const directory = `${await FileStorageModule.getDocumentDirectoryPath() + '/'+dirPathSound + name1}` // Directorio donde deseas guardar el archivo con el nuevo nombre

    // Realiza el cambio de nombre del archivo
    const newFilePath = await FileStorageModule.moveFile(oldUri, directory);
    const newPath = await FileStorageModule.renameFile(newFilePath, (newFileName+'.m4a'));

    console.log('Archivo renombrado exitosamente');
    return newPath;
  } catch (error) {
    console.error('Error al renombrar archivo:', error);
    return null; 
  }
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

  const handleDelete1 = async () => {
    try{
    const newItems = recordings.filter(item => item.name !== extraParam);
    setRecordings(newItems);

    const newConv = convinacion.filter(item => item.punch !== extraParam);
    setConvinacion(newConv);

    const fileUri = await FileStorageModule.getDocumentDirectoryPath() +'/'+ dirPathSound + name1 + '/'+extraParam+".m4a"; 

    // Eliminar el archivo
    await FileStorageModule.deleteFile(fileUri);
    console.log(`Archivo ${fileUri} eliminado correctamente.`);
    // Lógica para eliminar el elemento
    setAlertVisible(false);}catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }

  };
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

  const stopRecording = async () => {
    try {
      const result = await AudioModule.stopRecording();
      console.log("Recording stopped, file saved at:", result.filePath);
      console.log("Duration in milliseconds:", result.duration);
      const recordingPath = result.filePath;
      const durationMillis = result.duration;
      setPunch({
        duration: getDurationFormatted(durationMillis),
        file: recordingPath
      });

      toggleAlert2();
      setRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
  }

  return (
    <ScrollView
    scrollEnabled={!isDragging}
    contentContainerStyle={[{ flexGrow: 1, justifyContent: 'center' }, currentTheme.container]}>
    <View style={{height: '100%'}}>
      <Alert1
        visible={alertVisible}
        extraParam={extraParam}
        duration={duration2}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleConfirm}
        onDelete={handleDelete1}
      />

<Alert2
        visible={alertVisible1}
        extraParam={extraParam1}
        duration={duration1}
        duration1={duration2}
        delay={delay1}
        id={id}
        onClose={() => setAlertVisible1(false)}
        onConfirm={handleConfirm1}
        onDelete={handleDelete}
      />

<Alert3
        visible={alertVisible2}
        onClose={() => setAlertVisible2(false)}
        onConfirm={handleConfirm2}
      />
      <View style={{marginTop: 20}}>
        <TouchableOpacity style={[styles.convItem, {marginLeft: 14, marginRight: 14}]} onPress={recording ? stopRecording : startRecording} >
          <Text style={[{ textAlign: 'center' }, currentTheme.text]}>{recording ? trans.savePunch : trans.punch}</Text>
        </TouchableOpacity>
        <View style={styles.convBox}>
    {recordings.map((option) => (
      <TouchableOpacity key={option.name} onPress={() => toggleAlert(option.name, option.duration)} style={styles.convItem}>
        <Text style={[{ textAlign: 'center' }, currentTheme.text]}>{option.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
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
  <View style={styles.name}>
    <Text style={[{ paddingBottom: 5, fontSize: 16 }, currentTheme.text]}>{trans.name}</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
            <Text style={[{ fontSize: 30, paddingTop: 10 }, currentTheme.text]}>{name1}</Text>
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
        <Text style={[{ textAlign: 'center' }, currentTheme.text]} onPress={savePlay}>{trans.saveCont}</Text>
      </TouchableOpacity>
      <TouchableOpacity key={'guardar'} style={styles.convItemSave}>
        <Text style={[{ textAlign: 'center' }, currentTheme.text]} onPress={save}>{trans.save}</Text>
      </TouchableOpacity>
    </View>

  </View>
    </View>
    </ScrollView>

    
  );
}

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