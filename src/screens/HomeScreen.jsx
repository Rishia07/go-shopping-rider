import { useEffect } from "react";
import { fetchUser } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Text, Image, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/color";
import { greetings } from "../utils/greetings";
import ErrorText from "../components/ui/ErrorText";
import LoadingScreen from "./LoadingScreen";
import DefaultPic from "../assets/default-profile.jpg";
import OrdersList from "../components/list/OrdersList";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorText error={error.message || "An error occurred"} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Image
            style={styles.profilePic}
            source={user?.profilePic ? { uri: user.profilePic } : DefaultPic}
          />
        </Pressable>
        <View style={styles.infoContainer}>
          <Text style={styles.greetings}>{greetings()}</Text>
          <Text style={styles.username}>
            {`${user?.firstName} ${user?.lastName}` || "User"}
          </Text>
        </View>
      </View>
      <OrdersList navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: "relative",
    backgroundColor: Colors.bgBase100,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.bgBase200,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  infoContainer: {
    marginLeft: 15,
    justifyContent: "center",
  },
  greetings: {
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: "Poppins_400Regular",
    marginBottom: 4,
  },
  username: {
    fontSize: 22,
    color: Colors.textColor,
    fontFamily: "Poppins_600SemiBold",
  },
});