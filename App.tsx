import { PixelRatio } from 'react-native';
import SelectConvBox from './components/box/makeCombo/SelectConvBox';
import PlayCombBox from './components/box/playCombo/PlayCombBox';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListStoredItems from './components/box/listComb/ListComb';
import SelectConvCustom from './components/custom/makeCombo/SelectConvCustom';
import ListStoredItemsCustom from './components/custom/listComb/LisrCombCustom';
import PlayCombCustom from './components/custom/playCombo/PlayCombCustom';
import MainMenu from './components/main/MainMenu';
import SelectConvCustomEdit from './components/custom/editCombo/SelectConvCustomEdit';
import SelectConvBoxEdit from './components/box/editCombo/SelectConvBox';


const Stack = createNativeStackNavigator();

export default function App() {
  const scale = PixelRatio.get();
console.log(scale);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MainMenu} options={{ title: 'Inicio' }} />
        <Stack.Screen name="ListCustom" component={ListStoredItemsCustom} options={{ title: 'Custom' }} />
        <Stack.Screen name="ListBox" component={ListStoredItems} options={{ title: 'Box' }} />
        <Stack.Screen name="selectCustom" component={SelectConvCustom} options={{ title: 'Crear Combo' }} />
        <Stack.Screen name="editCustom" component={SelectConvCustomEdit} options={{ title: 'Editar Combo' }} />
        <Stack.Screen name="editBox" component={SelectConvBoxEdit} options={{ title: 'Editar Combo' }} />
        <Stack.Screen name="selectBox" component={SelectConvBox} options={{ title: 'Crear Combo' }}/>
        <Stack.Screen name="PlayBox" component={PlayCombBox} options={{ title: 'Reproducir Combo' }}/>
        <Stack.Screen name="PlayCustom" component={PlayCombCustom} options={{ title: 'Reproducir Combo' }}/>
      </Stack.Navigator>
    </NavigationContainer>

  );
}