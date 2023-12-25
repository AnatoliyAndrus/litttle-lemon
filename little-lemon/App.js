import { StyleSheet, Text, View, Image } from 'react-native';
import Onboarding from './screens/Onboarding';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from './screens/Profile';
import logo from './assets/Logo.png'
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, setState] = React.useState({isLoading:true, isOnboardingCompleted:false});

  React.useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const isOnboardingCompleted = await AsyncStorage.getItem('isOnboardingCompleted');
        console.log(isOnboardingCompleted+")");
        if(isOnboardingCompleted){
          setState({
            isLoading: false,
            isOnboardingCompleted: JSON.parse(isOnboardingCompleted),
          });
        }else{
          setState({
            isLoading: false,
            isOnboardingCompleted: false,
          });
        }
      } catch (error) {
        console.error('Error loading from AsyncStorage:', error);
      }
    };
    loadFromStorage();
  }, []);

  if (state.isLoading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={state.isOnboardingCompleted?"Home":"Onboarding"}
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



 function SplashScreen(){
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Image style={styles.logo} source={logo}></Image>
    </View>
  )
 }

const styles=StyleSheet.create({
  container:{
    flex:1,
  }
})