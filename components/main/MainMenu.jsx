import { Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
const styles = {
    text: {
color: 'black', fontSize: 40
    }
}
const MainMenu = ({navigation}) => {
  return (
    <ScrollView style={{ padding: 16}}>
                <TouchableOpacity style={{padding: 10, borderWidth: 4, borderRadius: 10, marginBottom: 20, height: 90}} onPress={() =>
            {
                navigation.navigate('ListBox');
            }
            }>
            <Text style={styles.text} >
                Box
            </Text>
        </TouchableOpacity>
         <TouchableOpacity style={{padding: 10, borderWidth: 4, borderRadius: 10, marginBottom: 20}} onPress={() =>
            {
                navigation.navigate('ListCustom');
            }
            }>
            <Text style={styles.text}>
                Custom
            </Text>
        </TouchableOpacity> 
    </ScrollView>
  )
}

export default MainMenu