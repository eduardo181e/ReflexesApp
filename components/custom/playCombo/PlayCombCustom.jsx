import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { NativeModules } from 'react-native';
const { FileStorageModule } = NativeModules;
const { AudioModule } = NativeModules;
import { useFocusEffect } from '@react-navigation/native';
import CircularProgress from './CircularProgress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { lightTheme, darkTheme } from '../../../contexts/Styles';
const PlayCombCustom = ({ route, navigation }) => {
  const { name } = route.params;
  const stopRef = useRef(false);
  const combo = useRef({});
  const [pause, setPause] = useState(true);
  const index1 = useRef(0);
  const lenght = useRef(0);
  const i1 = useRef(0);
  const dirPath = `/custom/arrays/`;
  const dirPathSound = `/custom/sound/`;
  const [ciclo, setCiclo] = useState(0);
  const [currentCiclo, setCurrentCiclo] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentName, setName] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const timeoutIds = useRef([]);
  const [remainingTime, setRemainingTime] = useState(null);
  const [percentageTime, setPercentageTime] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [playTime, setPlayTime] = useState(null);
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'Light' ? lightTheme : darkTheme;

  const handleTimeUpdate = (time) => {
    setRemainingTime(time.time);
    setPercentageTime(time.percentage)
  };

  const clearAllTimeouts = () => {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
  };

  useEffect(() => {
    loadConv();

    return () => {
      const  stop =  async () => {
       await AudioModule.stopAudio()
      }
      stop();

    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Esta función se ejecuta cuando la pantalla obtiene el enfoque
      stopRef.current = false;
      return () => {
        navigation.navigate('ListCustom');
        stopRef.current = true;
        const  stop =  async () => {
          await AudioModule.stopAudio()
          }
          stop();
      };
    },[navigation])
  );
  async function reanudar() {
    stopRef.current = false;
    if(combo.current.convinacion.length === 0){
      loadConv()
    }else{
    try {
      let o = ciclo + 1;
      setCiclo(o);
      stopRef.current = false;
        console.log(combo.current.convinacion.length);
        console.log(index1.current);
        console.log(i1.current);
        
        i = i1.current;
        while (i < combo.current.convinacion.length && !stopRef.current) {
          console.log(i);
          await playCombo1(combo.current, o);
          i++;
        }
    } catch (error) {
      console.error('Error al cargar el combo 1:', error);
    }      
    }

  }

  const pickUpArray = (array) => {
    let o = [];
    let i = 0; // Inicializamos la variable `i`
  
    // Bucle para repetir el forEach según el número de repeticiones
    while (i < array.repetitions) {
      array.convinacion.forEach((e) => {
        o.push(e);
      });
      i++; // Incrementamos `i` después de cada iteración
    }
  
    // Construimos el objeto `combo` con los valores generados
    let combo = {
      convinacion: o,
      repetitions: array.repetitions,
      delay: array.delay,
      length: array.convinacion.length,
    };
  
    return combo;
  };

 let i = 0
  async function loadConv() {
    const filename = (await FileStorageModule.getDocumentDirectoryPath()) + dirPath + name
    try {
      lenght.current = 0
      index1.current = 0
      let o = (ciclo+1)
      setCiclo(o)
      const retrievedCombo1 = await FileStorageModule.readFile(filename);
      stopRef.current = false;
      if (retrievedCombo1) {
        const combo1Object = JSON.parse(retrievedCombo1);
        console.log('Combo 1 recuperado:', combo1Object);
        console.log('Repeticiones:', combo1Object.repetitions);
        let combo1 = pickUpArray(combo1Object);
        combo.current = combo1
        i = 0
        console.log('Estes es el combo 1' + combo1)
        while (i < (parseInt(combo1.convinacion.length)) && !stopRef.current) {
          console.log(i)
          await playCombo(combo1, o); // Pasar el combo completo
        }
      } else {
        console.log('No se encontró combo 1 en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al cargar el combo 1:', error);
      console.log('esta es la ruta ' + filename )
    }
  }

  const playCombo = async (combo, ciclo1) => {
    let index = 0;
    const playNext = async () => {
      if (index >= combo.convinacion.length || stopRef.current) {   
        return;
      }
      
      const e = combo.convinacion[index];

      
      console.log('remaining time: '+remainingTime)
      
      await new Promise(resolve => {
        if(stopRef.current || ciclo1 < currentCiclo) {   
          return;
        }
        lenght.current = combo.convinacion.length
        console.log('principio del ciclo'+((index) % combo.length))
        if((index % combo.length) === 0 || index === 0) {
          setPercentage(0)
          clearAllTimeouts();
          const timeoutId = setTimeout(async () => {
            if (stopRef.current || ciclo1 < currentCiclo) {
              return;
            }else{
              i++
              await playPunch(e, ciclo1);
              index++;
              index1.current = index
              resolve();                
                }
          }, ((parseInt(combo.delay)*1000) + (parseInt(e.delay))));
          timeoutIds.current.push(timeoutId);
          setCurrentTime((parseInt(combo.delay)*1000) + (parseInt(e.delay)), e.punch);
          setName(e.punch)
          
          setResetKey(i + 1)
          }else{
            clearAllTimeouts();
            const timeoutId = setTimeout(async () => {
              if (stopRef.current || ciclo1 < currentCiclo) {
                return;
              }else{
            i++
            await playPunch(e, ciclo1);
            index++;
            index1.current = index
            resolve();                
              }

          },  parseInt(e.delay));
          timeoutIds.current.push(timeoutId);
          setCurrentTime(parseInt(e.delay), e.punch);
          setName(e.punch)
          setPercentage(0)
          setResetKey(i + 1)
          }   
    });
      await playNext();
    };
  
    await playNext();
  };

  const playCombo1 = async (combo, ciclo1) => {
    let index = 0;
    const playNext = async () => {
      if (index >= lenght.current || stopRef.current) {   
        return;
      }
      
      const e = combo.convinacion[index];
      setName(e.punch)
      
      await new Promise(resolve => {
        if(stopRef.current || ciclo1 < currentCiclo) {   
          return;
        }
        console.log('remaining: '+remainingTime)
        console.log('principio del ciclo'+index1.current % combo.length)
        if(index === 0){
          setPercentage(percentageTime)
          clearAllTimeouts();
          const timeoutId = setTimeout(async () => {
            if (stopRef.current || ciclo1 < currentCiclo) {
              return;
            }else{
          i++
          await playPunchP(e, ciclo1);
          index++;
          index1.current = index1.current + 1
          resolve();                
            }

        },  parseInt(remainingTime));
        timeoutIds.current.push(timeoutId);
        setCurrentTime(parseInt(remainingTime), e.punch);
        setResetKey(i + 1)
        }else{
        if((index1.current % combo.length) === 0 || index1.current === 0) {
          clearAllTimeouts();
          const timeoutId = setTimeout(async () => {
            if (stopRef.current || ciclo1 < currentCiclo) {
              return;
            }else{
              i++
              await playPunch(e, ciclo1);
              index++;
              index1.current = index1.current + 1
              resolve();                
                }
          }, ((parseInt(combo.delay)*1000) + (parseInt(e.delay))));
          timeoutIds.current.push(timeoutId);
          setCurrentTime((parseInt(combo.delay)*1000) + (parseInt(e.delay)), e.punch);
          setName(e.punch)
          setPercentage(0)
          setResetKey(i + 1)
          }else{
            clearAllTimeouts();
            const timeoutId = setTimeout(async () => {
              if (stopRef.current || ciclo1 < currentCiclo) {
                return;
              }else{
            i++
            await playPunch(e, ciclo1);
            index++;
            index1.current = index1.current + 1
            resolve();                
              }

          },  parseInt(e.delay));
          timeoutIds.current.push(timeoutId);
          setCurrentTime(parseInt(e.delay), e.punch);
          setName(e.punch)
          setPercentage(0)
          setResetKey(i + 1)
          }
        }    
    });
      await playNext();
    };
  
    await playNext();
  };
  
  
  const playPunch = async (e, ciclo1) => {
    soundPath = await FileStorageModule.getDocumentDirectoryPath()+ dirPathSound +name + '/' + e.punch+'.m4a';
    
    const MAX_LONG = 9223372036854775807; // Long.MAX_VALUE
    const MIN_LONG = -9223372036854775808; // Long.MIN_VALUE
    
    let duration = parseInt(e.duration, 10); // Convierte e.duration a un número entero
    
    if (isNaN(duration)) {
      console.error("Invalid duration: not a number");
    } else if (duration > MAX_LONG || duration < MIN_LONG) {
      console.error("Invalid duration: out of Long range");
    } else {
      try {
        if(ciclo1 < currentCiclo) {   
          return;
        }else {
          await AudioModule.playAudio1(soundPath, duration)
        const updatedConvinacion = [...combo.current.convinacion];
        updatedConvinacion.splice(0, 1);
        combo.current = {
          ...combo.current,
          convinacion: updatedConvinacion,
        };
        console.log('Combo actualizado:', combo.current);
        if(updatedConvinacion.length === 0) {
          setName('Ended')
          setPause(false)
          }
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }

  
  };

  const playPunchP = async (e, ciclo1) => {
    soundPath = await FileStorageModule.getDocumentDirectoryPath()+ dirPathSound +name + '/' + e.punch+'.m4a';
    
    const MAX_LONG = 9223372036854775807; // Long.MAX_VALUE
    const MIN_LONG = -9223372036854775808; // Long.MIN_VALUE
    
    let duration = parseInt(e.duration, 10); // Convierte e.duration a un número entero
    
    if (isNaN(duration)) {
      console.error("Invalid duration: not a number");
    } else if (duration > MAX_LONG || duration < MIN_LONG) {
      console.error("Invalid duration: out of Long range");
    } else {
      try {
        if(ciclo1 < currentCiclo) {   
          return;
        }else {
          if(playTime === null){
          await AudioModule.playAudio1(soundPath, duration)
          }else {
            await AudioModule.reanudarAudio1(soundPath, duration, playTime)
          }
        const updatedConvinacion = [...combo.current.convinacion];
        updatedConvinacion.splice(0, 1);
        combo.current = {
          ...combo.current,
          convinacion: updatedConvinacion,
        };
        console.log('Combo actualizado:', combo.current);
        if(updatedConvinacion.length === 0) {
          setName('Ended')
          setPause(false)
          }
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }

  
  };
  

  return (
    <View style={[currentTheme.container, {height: '100%'}]}>
      <View style={styles.progress}>
        <CircularProgress time={currentTime} endText={currentName} resetKey={resetKey} isPaused={pause} onTimeUpdate={handleTimeUpdate} initialPercentage={percentage}/>
      </View>
      <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.button} onPress={async () => {
       try {
        await AudioModule.stopAudio();
        setCurrentCiclo(currentCiclo + 1);
      } catch (error) {
        console.error('Error stopping audio:', error);
      } finally {
        stopRef.current = true;
        console.log(stopRef.current);
        setPause(true)

            loadConv();

      }
      }}>
        <Icon name="replay" size={50} color={theme === 'Light' ? '#333' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity  style={styles.button} onPress={async () => {
        if(pause){
        setPause(false)
        }else{
          setPause(true)
        }
       try {
        let pauseTime = await AudioModule.pauseAudio();
        setPlayTime(pauseTime)
        console.log('pauseTime: '+pauseTime)
        await AudioModule.stopAudio();
        setCurrentCiclo(currentCiclo + 1);
      } catch (error) {
        console.error('Error stopping audio:', error);
      } finally {
        if(pause){
          stopRef.current = true;
          console.log(stopRef.current);
          }else{
            stopRef.current = true;
            console.log(stopRef.current);
                reanudar();
          }   
        }
      
      }}>
        <Icon name={pause ?  'pause' : 'play-arrow'} size={50} color={theme === 'Light' ? '#333' : '#fff'} />
      </TouchableOpacity>
      </View>
      <View style={styles.container}>
      </View>

    </View>
  )
}

export default PlayCombCustom

const styles = StyleSheet.create({
  button: {padding: 10, borderRadius: 10, marginBottom: 5, zIndex: 1, width: 80, height: 80},
  element: {width: '100%', height: '100%', position: 'absolute', zIndex: 3},
  progress: {marginBottom: 40, marginTop: 40},
  buttonContainer: {display: 'flex', flexDirection: 'row', marginLeft: '27%', gap: 40},
})