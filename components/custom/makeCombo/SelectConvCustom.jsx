import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Button, ScrollView, Dimensions, PermissionsAndroid, Platform, Linking } from 'react-native'; // Importa TouchableOpacity para una posible interacción
import { StyleSheet } from 'react-native';
import Alert1 from '../makeCombo/SpeedPunch';
import Alert2 from '../makeCombo/SpeedPunchEdit';
import { NativeModules } from 'react-native';
const { AudioModule } = NativeModules;
import Alert3 from '../makeCombo/NamePunchEdit';
const { FileStorageModule } = NativeModules;
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const showAlert = (message) => {
  
  Alert.alert(
    'Alert Title',
    message,
    [
      { text: 'OK', onPress: () => console.log('OK button pressed') }
    ],
  );
};

export default function App({navigation}) {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [punch, setPunch] = React.useState({});
  const [name, setName] = useState('')
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
  const [isDragging, setIsDragging] = useState(false);

  const cicle = {
    delay: 0,
    repetitions: 0,
    convinacion: [],
    name: ''
  }

  useFocusEffect(
    useCallback(() => {
  
      return async () => {
        if(recording){
          await AudioModule.stopRecording();
        }
      };
    }, [recording]) 
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
    if (name.trim() === '') {
      showAlert('El nombre del archivo no puede estar vacío.');
      return;
    }else if(repetitions === 0){
        showAlert('Las repeticiones no pueden ser cero');
      }else if(delay === 0){
        showAlert('El tiempo que tarda en comenzar no puede ser cero');
      }else{
     
        const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/custom/arrays/`;
        const filePath = `${dirPath + name.trim()}`;
        
        const dirInfo = await FileStorageModule.fileExists(filePath);
        if (dirInfo) {
        showAlert('Archivo existente', `El archivo "${name.trim()}" ya existe.`);
      } else {
        await createAndStoreArray();
        await moveAudioFiles(recordings, name)
        showAlert('Combo guardado correctamente');
        navigation.navigate('ListCustom');
      }

  }
}

  const savePlay = async () => {
    if (name.trim() === '') {
      showAlert('El nombre del archivo no puede estar vacío.');
      return;
    }else if(repetitions === 0){
        showAlert('Las repeticiones no pueden ser cero');
      }else if(delay === 0){
        showAlert('El tiempo que tarda en comenzar no puede ser cero');
      }else{
     
     
        const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/custom/arrays/`;
        const filePath = `${dirPath + name.trim()}`;
        
        const dirInfo = await FileStorageModule.fileExists(filePath);
      if (dirInfo) {
        showAlert('Archivo existente', `El archivo "${name.trim()}" ya existe.`);
      } else {
        await createAndStoreArray();
        await moveAudioFiles(recordings, name)
        showAlert('Combo guardado correctamente');
        navigation.navigate('PlayCustom', { name: name.trim() });
      }

    }

    console.log(recordings)
    console.log(convinacion),
    console.log(recordings)
  }

  const createAndStoreArray = async () => {
    const dirPath = `${await FileStorageModule.getDocumentDirectoryPath()}/custom/arrays/`;
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

  const moveAudioFiles = async (audioFiles, folderName) => {
    const baseDir = `${await FileStorageModule.getDocumentDirectoryPath()}/custom/sound/`;
    const targetDir = `${baseDir}${folderName.trim()}/`;
  
    // Crear la carpeta si no existe
    const dirInfo = await FileStorageModule.fileExists(targetDir);
    if (!dirInfo) {
      await FileStorageModule.createDirectory(targetDir);
    }
  
    // Mover los archivos de audio
    for (const file of audioFiles) {
  
      await FileStorageModule.moveFile(file.file, targetDir);
    }
    console.log('Archivos de audio movidos a:', targetDir);
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
    showAlert('El nombre de archivo no puede estar vacio')
  }else{
  try {
    // Verifica si ya existe un archivo con el mismo nombre
    const existingRecording = recordings.find(recording => recording.name === inputValues);

    if (existingRecording) {
      showAlert('El nombre de archivo ya existe en el array. No se puede completar la acción.')
      return;
    }else{
    // Realiza el cambio de nombre del archivo
    console.log(punch.file)
    console.log(inputValues)
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
    const directory = await FileStorageModule.getDocumentDirectoryPath(); // Directorio donde deseas guardar el archivo con el nuevo nombre

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

    const fileUri = await FileStorageModule.getDocumentDirectoryPath()+'/'+extraParam+".m4a"; 

    // Eliminar el archivo
    await FileStorageModule.deleteFile(fileUri);
    console.log(`Archivo ${fileUri} eliminado correctamente.`);
    // Lógica para eliminar el elemento
    setAlertVisible(false);}catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }

  };

  const ListItem = ({ item, drag }) => {
    return (
        <View>
            <TouchableOpacity
                onLongPress={drag}
                style={styles.convItemLine}
                onPress={() => toggleAlert1(item.id)}
            >
                <Text style={{ height: 20, color: 'black' }}>{item.punch}</Text>
            </TouchableOpacity>
        </View>
    );
};

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

  const screenHeight = Dimensions.get('window').height;

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
  }

  return (
    <ScrollView scrollEnabled={!isDragging} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
    <View style={{height: '100%', color: 'black'}}>
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
        <Button title={recording ? 'Detener Grabacion' : 'Nuevo Golpe'} onPress={recording ? stopRecording : startRecording} />
        <View style={styles.convBox}>
    {recordings.map((option) => (
      <TouchableOpacity key={option.name} onPress={() => toggleAlert(option.name, option.duration)} style={styles.convItem}>
        <Text style={{textAlign: 'center',color: 'black'}}>{option.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
      </View>
      

  <View style={{marginBottom: 20}}>
      <View style={styles.convBoxVar}>
    <Text style={{paddingBottom: 5, fontSize: 15,color: 'black'}}>Tiempo que tarda en comenzar</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
             <TextInput
        style={styles.convBoxVarInput}
        keyboardType="numeric"
        value={delay}
        onChangeText={(texto) => setDelayP(texto)}
      /> 
      </View>
      <Text style={{fontSize: 20, paddingTop: 20, color: 'black'}}>S</Text>
    </View>
  </View>
  <View style={styles.convBoxVar}>
    <Text style={{paddingBottom: 5, fontSize: 15,color: 'black'}}>Veces que quieres que se repita el ciclo</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
             <TextInput
        style={styles.convBoxVarInput}
        keyboardType="numeric"
        value={repetitions}
        onChangeText={(texto) => setrepetitions(texto)}
      /> 
      </View>
    </View>
  </View>
  <View style={styles.convBoxVar}>
    <Text style={{paddingBottom: 5, fontSize: 15,color: 'black'}}>Nombre de el combo</Text>
    <View style={{flexDirection: 'row', width: '100%'}}>
      <View style={{width: '85%', paddingRight: 10}}>
             <TextInput
        style={styles.convBoxVarInput}
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
          <Text style={{ padding: 10, fontSize: 20, color: 'black' }}>Linea de Tiempo</Text>
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
        <Text style={{textAlign: 'center',color: 'black'}} onPress={savePlay}>Guardar y Comenzar</Text>
      </TouchableOpacity>
      <TouchableOpacity key={'guardar'} style={styles.convItemSave}>
        <Text  style={{textAlign: 'center',color: 'black'}} onPress={save}>Guardar</Text>
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
    width: '100%',color: 'black'
  },
  convBoxVarInput: {
    // Agrega estilos para la clase 'convBox' aquí, por ejemplo,
    flexDirection: 'column', // Organiza los elementos en una fila
    flexWrap: 'wrap', // Permite que los elementos se ajusten a varias líneas
    padding: 10, // Agrega relleno para el espaciado
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    color: 'black'
  },
  convItem: {
    // Agrega estilos para los elementos individuales 'convItem' aquí, por ejemplo,
    backgroundColor: '#eee', // Color de fondo claro
    margin: 5, // Agrega márgenes para la separación
    padding: 10, // Agrega relleno para el contenido
    borderRadius: 10, // Esquinas redondeadas para el atractivo visual
    flex: 1,
    flexBasis: 100,
    borderWidth: 1,
    color: 'black'
  },

  convItemSave: {
    // Agrega estilos para los elementos individuales 'convItem' aquí, por ejemplo,
    backgroundColor: '#eee', // Color de fondo claro
    margin: 5, // Agrega márgenes para la separación
    padding: 10, // Agrega relleno para el contenido
    borderRadius: 5, // Esquinas redondeadas para el atractivo visual
    width: '50%',
    marginLeft: '25%',
    borderWidth: 1, //
    color: 'black'
  },

  convItemLine: {
    // Agrega estilos para los elementos individuales 'convItem' aquí, por ejemplo,
    backgroundColor: '#eee', // Color de fondo claro
    margin: 5, // Agrega márgenes para la separación
    padding: 10, // Agrega relleno para el contenido
    borderRadius: 10, // Esquinas redondeadas para el atractivo visual,
    borderWidth: 1, //
    color: 'black'
  },

});