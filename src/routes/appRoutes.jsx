import HomeScreen from "../screens/HomeScreen";
import ViewOrderScreen from "../screens/ViewOrderScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditPersonalInfoScreen from "../screens/EditPersonalInfoScreen";
import DeliveryHistoryScreen from "../screens/DeliveryHistoryScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import { ScreenOptions } from "../utils/screenOptions";

export const appRoutes = [
  { name: "Home", component: HomeScreen, options: { headerShown: false } },
  {
    name: "ViewOrder",
    component: ViewOrderScreen,
    options: { ...ScreenOptions, title: "View Order" },
  },
  {
    name: "Settings",
    component: SettingsScreen,
    options: { ...ScreenOptions, title: "Your Profile" },
  },
  {
    name: "EditPersonalInfo",
    component: EditPersonalInfoScreen,
    options: { ...ScreenOptions, title: "Edit Personal Info" },
  },
  {
    name: "DeliveryHistory",
    component: DeliveryHistoryScreen,
    options: { ...ScreenOptions, title: "Deliverie" },
  },
  {
    name: "ChangePassword",
    component: ChangePasswordScreen,
    options: { ...ScreenOptions, title: "Change Password" },
  },
  { name: "Login", component: LoginScreen, options: { headerShown: false } },
];
