import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/color";

export default function Button({
  onPress,
  loading,
  text,
  variant = "primary",
  disabled,
}) {

  const buttonStyles = [
    styles[variant + "Button"],
    disabled && styles.disabledButton,
  ];

  const buttonTextStyles = [
    styles[variant + "ButtonText"],
    disabled && styles.disabledButtonText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={25} color="white" />
          <Text style={buttonTextStyles}>Loading...</Text>
        </View>
      ) : (
        <Text style={buttonTextStyles}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 12,
    width: "100%",
  },
  secondaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
  },
  dangerButton: {
    alignItems: "center",
    backgroundColor: "red",
    padding: 15,
    borderRadius: 12,
  },
  dangerButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
  },
  disabledButton: {
    backgroundColor: "#AAAAAA",
  },
  disabledButtonText: {
    color: "#666666",
  },
});
