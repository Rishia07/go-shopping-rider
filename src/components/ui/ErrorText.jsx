import { Text, View, StyleSheet } from "react-native";
import { Colors } from "../../constants/color";

export default function ErrorText({ error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.error400,
    backgroundColor: Colors.bgBase200,
  },
  title: {
    fontSize: 20,
    color: Colors.error400,
    fontFamily: "Poppins_500Medium",
  },
});
