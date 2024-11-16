import { View, Pressable, Text, StyleSheet, FlatList } from "react-native";
import { Popup } from "react-native-popup-confirm-toast";
import { Colors } from "../../constants/color";
import settings from "../../data/settingList.json";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logout } from "../../features/authSlice";
import { useDispatch } from "react-redux";

export default function AccountSettingList({ navigation }) {
  const dispatch = useDispatch();
  const handleLogOut = () => {
    Popup.show({
      type: "confirm",
      title: "Logout Confirmation",
      textBody: "Are you sure you want to logout?",
      buttonText: "Yes",
      confirmText: "No",
      iconEnabled: false,
      titleTextStyle: { fontFamily: "Poppins_700Bold", textAlign: "left" },
      descTextStyle: { fontFamily: "Poppins_400Regular", textAlign: "left" },
      okButtonStyle: { backgroundColor: Colors.error400 },
      buttonContentStyle: { flexDirection: "row-reverse" },
      callback: async () => {
        await dispatch(logout());
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        Popup.hide();
      },
      cancelCallback: () => {
        Popup.hide();
      },
    });
  };

  const settingItem = ({ item }) => (
    <Pressable style={styles.settingItem} onPress={() => navigation.push(item.path)}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon} color={Colors.light} size={25} />
        </View>
        <Text style={styles.label}>{item.label}</Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        color={Colors.secondaryColor}
        size={30}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={settings}
        renderItem={settingItem}
        keyExtractor={(item) => item.id}
      />
      <Pressable style={styles.logoutButton} onPress={handleLogOut}>
        <View style={styles.settingLogoutIcon}>
          <Ionicons name="log-out-outline" color={Colors.light} size={25} />
        </View>
        <Text style={styles.logoutLabel}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.bgBase200,
    padding: 6,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondaryColor,
  },
  label: {
    fontSize: 18,
    color: Colors.secondaryColor,
    fontFamily: "Poppins_500Medium",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    marginTop: 12,
  },
  settingLogoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error400,
  },
  logoutLabel: {
    fontSize: 18,
    color: Colors.error400,
    fontFamily: "Poppins_500Medium",
  },
});
