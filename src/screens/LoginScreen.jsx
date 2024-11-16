import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/color";
import LoginForm from "../components/forms/LoginForm";
import Logo from "../assets/logo.png";

export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Go Shopping Rider</Text>
        <Text style={styles.subTitle}>Login to continue</Text>
        <LoginForm navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 32,
    color: Colors.primaryColor,
    fontFamily: "Poppins_600SemiBold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "semibold",
    color: Colors.textColor,
    fontFamily: "Poppins_500Medium",
  },
});
