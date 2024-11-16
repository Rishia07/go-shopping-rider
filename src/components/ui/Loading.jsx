import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/color";

export default function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Loading</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: Colors.textColor,
    fontFamily: "Poppins_500Medium",
  },
  animation: {
    width: 200,
    height: 80,
  },
});
