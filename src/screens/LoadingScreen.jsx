import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/color";

export default function LoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <ActivityIndicator size={100} color={Colors.primaryColor} />
        <Text style={styles.title}>Loading...</Text>
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
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    color: Colors.primaryColor,
  },
});
