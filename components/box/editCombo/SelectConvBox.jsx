import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Button, ScrollView } from 'react-native'; // Importa TouchableOpacity para una posible interacción
import { StyleSheet } from 'react-native';
import Alert1 from './SpeedPunch';
import Alert2 from './SpeedPunchEdit';
import { useFocusEffect } from '@react-navigation/native';
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;
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


const SelectConvBoxEdit = ({ navigation, route }) => {
  const [recordings, setRecordings] = React.useState([
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
  ]);
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
  const dirPath = `/box/arrays/`;
  const { name1 } = route.params;
  const [isDragging, setIsDragging] = useState(false);

  const cicle = {
    delay: 0,
    repetitions: 0,
    convinacion: [],
    name: ''
  }

  useEffect(() => {
    const fetchData = async () => {
      const dipath1 = await FileStorageModule.getDocumentDirectoryPath()
      const filename = dipath1 + dirPath + name1
      try {

        const content = await FileStorageModule.readFile(filename);
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
      return () => {
          createAndStoreArray()
      };
    }, [name1, delay, convinacion, repetitions])
  );

  const save = async () => {
    if(repetitions === 0){
        showAlert('Las repeticiones no pueden ser cero');
      }else if(delay === 0){
        showAlert('El tiempo que tarda en comenzar no puede ser cero');
      }else{
     
        await createAndStoreArray();
        showAlert('Combo guardado correctamente');
        navigation.navigate('ListBox');
      

    }

    
    console.log(convinacion)
  }

  const createAndStoreArray = async () => {
    const dipath1 = await FileStorageModule.getDocumentDirectoryPath()
    const filePath = `${dipath1+dirPath+name1.trim()}`;

    cicle.delay = delay
    cicle.convinacion = convinacion
    cicle.repetitions = repetitions
    console.log(cicle)
    const jsonString = JSON.stringify(cicle)
    await FileStorageModule.writeFile(filePath, jsonString);
    console.log('Archivo creado y array almacenado en:', filePath);
  };

  const savePlay = async () => {
     if(repetitions === 0){
        showAlert('Las repeticiones no pueden ser cero');
      }else if(delay === 0){
        showAlert('El tiempo que tarda en comenzar no puede ser cero');
      }else{

        await createAndStoreArray();
        showAlert('Combo guardado correctamente');
        navigation.navigate('PlayBox', { name: name1.trim()});
      

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
    console.log(inputValues)
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
  const ListItem = ({ item, drag }) => (
    <View key={item.id.toString()} style={styles.itemContainer}>
      <TouchableOpacity
        onLongPress={drag}
        onPress={() => toggleAlert1(item.id)}
        style={styles.convItemLine}
      >
        <Text style={{ height: 20, color: 'black' }}>{item.punch}</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDragEnd = ({ data }) => {
    setConvinacion([...data]);
    console.log(data); 
    setIsDragging(false);

  };
  return (
    <ScrollView
    scrollEnabled={!isDragging}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <View style={{ height: '100%' }}>
        {/* Alert Components */}
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

        {/* Recordings List */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.convBox}>
            {recordings.map((option) => (
              <TouchableOpacity key={option} onPress={() => toggleAlert(option)} style={styles.convItem}>
                <Text style={{ textAlign: 'center', color: 'black' }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.convBoxVar}>
            <Text style={{ paddingBottom: 5, fontSize: 15, color: 'black' }}>Tiempo que tarda en comenzar</Text>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '85%', paddingRight: 10 }}>
                <TextInput
                  style={styles.convBoxVarInput}
                  keyboardType="numeric"
                  value={delay}
                  onChangeText={(texto) => setDelayP(texto)}
                />
              </View>
              <Text style={{ fontSize: 20, paddingTop: 20, color: 'black' }}>S</Text>
            </View>
          </View>
          <View style={styles.convBoxVar}>
            <Text style={{ paddingBottom: 5, fontSize: 15, color: 'black' }}>Veces que quieres que se repita el ciclo</Text>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '85%', paddingRight: 10 }}>
                <TextInput
                  style={styles.convBoxVarInput}
                  keyboardType="numeric"
                  value={repetitions}
                  onChangeText={(texto) => setrepetitions(texto)}
                />
              </View>
            </View>
          </View>
          <View style={styles.name}>
            <Text style={{ paddingBottom: 5, fontSize: 15, color: 'black' }}>Nombre del Combo</Text>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '85%', paddingRight: 10 }}>
                <Text style={{ fontSize: 30, paddingTop: 10, color: 'black' }}>{name1}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Draggable List */}
        <View style={{ marginBottom: 20 }}>
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

        {/* Save Buttons */}
        <View>
          <TouchableOpacity key={'guardaryCom'} style={styles.convItemSave} onPress={savePlay}>
            <Text style={{ textAlign: 'center', color: 'black' }}>Guardar y Comenzar</Text>
          </TouchableOpacity>
          <TouchableOpacity key={'guardar'} style={styles.convItemSave} onPress={save}>
            <Text style={{ textAlign: 'center', color: 'black' }}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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

export default SelectConvBoxEdit;