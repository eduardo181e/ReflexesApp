import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions  } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedProps } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ time, endText, resetKey, isPaused, onTimeUpdate, initialPercentage}) => {
  const [remainingTime, setRemainingTime] = useState(time);
  const [percentageTime, setPercentageTime] = useState(time);
  const [finished, setFinished] = useState(false);
  const { width } = Dimensions.get('window');
  const radius = width * 0.4;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const progressValue = useSharedValue(circumference);
  useEffect(() => {
    let interval
    if(isPaused){
    setFinished(false);
    setRemainingTime(time);

    const startTime = Date.now();

    interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const adjustedTime = Math.max(0, time - elapsedTime);
      const initialTimeFactor = initialPercentage / 100;
      
      const remainingFactor = (1 - initialTimeFactor);
      const adjustedNewTime = adjustedTime * remainingFactor;
    
      const newPercentage = ((time - adjustedNewTime) / time) * 100;
    
      setPercentageTime(newPercentage);
      setRemainingTime(adjustedNewTime);
    
      progressValue.value = circumference * (1 - newPercentage / 100);
    
      if (adjustedNewTime <= 0) {
        clearInterval(interval);
        setFinished(true);
      }
    }, 10);
  

    return () => {
      clearInterval(interval);
    };
  }else{
    console.log(remainingTime)
    clearInterval(interval);
    onTimeUpdate({time: remainingTime, percentage: percentageTime} );
  }
  }, [time, resetKey, isPaused]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progressValue.value, // Progreso animado
  }));


  return (
    <View style={styles.container}>
  <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
    <Circle
      cx={radius}
      cy={radius}
      r={radius - strokeWidth / 2}
      stroke="#e6e6e6"
      strokeWidth={strokeWidth}
      fill="none"
    />
    <AnimatedCircle
      cx={radius}
      cy={radius}
      r={radius - strokeWidth / 2}
      stroke="#332b52"
      strokeWidth={strokeWidth}
      fill="none"
      strokeDasharray={circumference} // Valor estático
      animatedProps={animatedProps} // Valor animado
    />
  </Svg>
{!finished ? (
  isNaN(remainingTime) ? (
    <Text style={styles.finishedText}>{endText}</Text>
  ) : (
    <Text style={styles.timeText}>{remainingTime.toFixed(0)} ms</Text>
  )
) : (
  <Text style={styles.finishedText}>{endText}</Text>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    position: 'absolute',
    fontSize: 40,
    color: '#332b52',
  },
  finishedText: {
    position: 'absolute',
    fontSize: 40,
    color: '#332b52',
  },
});

export default CircularProgress;