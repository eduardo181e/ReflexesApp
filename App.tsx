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
import Settings from './components/settings/Setings';
import { LanguageContext, LanguageProvider } from './contexts/LanguageContext';
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
import { darkTheme, lightTheme } from './contexts/Styles';
import { useContext } from 'react';
import translations from './contexts/translations';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { language } = useContext(LanguageContext); // Ahora seguro
  const { theme } = useContext(ThemeContext);
  const trans = translations[language].title
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: theme === 'Light' ? '#fff' : '#333' }, // Fondo del encabezado
          headerTintColor: theme === 'Light' ? '#333' : '#fff', // Color del texto del título
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }, // Estilo del título
        }}
      >
        <Stack.Screen
          name="Home"
          component={MainMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ListCustom" component={ListStoredItemsCustom} options={{ title: trans.custom }} />
        <Stack.Screen name="ListBox" component={ListStoredItems} options={{ title: trans.box }} />
        <Stack.Screen name="selectCustom" component={SelectConvCustom} options={{ title: trans.create }} />
        <Stack.Screen name="editCustom" component={SelectConvCustomEdit} options={{ title: trans.edit }} />
        <Stack.Screen name="editBox" component={SelectConvBoxEdit} options={{ title: trans.edit }} />
        <Stack.Screen name="selectBox" component={SelectConvBox} options={{ title: trans.create }} />
        <Stack.Screen name="PlayBox" component={PlayCombBox} options={{ title: trans.play }} />
        <Stack.Screen name="PlayCustom" component={PlayCombCustom} options={{ title: trans.play }} />
        <Stack.Screen name="Settings" component={Settings} options={{ title: trans.settings }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
