import { useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Colors } from "../../constants/color";
import Icon from "react-native-vector-icons/FontAwesome";

export default function PasswordInput({
  placeholder,
  value,
  onChangeText,
  errorMessage,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.passwordContainer, errorMessage && styles.inputError]}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder || "Password"}
          placeholderTextColor={Colors.textColorr}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <Icon
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.bgBase200,
    borderColor: Colors.secondaryColor,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: Colors.textColor,
  },
  inputError: {
    borderColor: Colors.error400,
  },
  errorText: {
    color: Colors.error400,
    fontSize: 12,
    marginTop: 5,
  },
});
