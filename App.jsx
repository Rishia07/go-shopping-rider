import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Root as PopupRootProvider } from "react-native-popup-confirm-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authRoutes } from "./src/routes/authRoutes";
import { Provider } from "react-redux";
import { store } from "./src/features/store";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import LoadingScreen from "./src/screens/LoadingScreen";


const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PopupRootProvider>
            <NavigationContainer>
              <Stack.Navigator>
                {authRoutes.map(
                  ({ name, component, options }) => (
                    <Stack.Screen
                      key={name}
                      name={name}
                      component={component}
                      options={options}
                    />
                  )
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </PopupRootProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}
