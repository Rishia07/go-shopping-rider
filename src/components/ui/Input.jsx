import { TextInput, StyleSheet, View, Text } from "react-native";
import { Colors } from "../../constants/color";

export default function Input({
  placeholder,
  value,
  onChangeText,
  errorMessage,
  maxLength,
  keyboardType,
  editable
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errorMessage && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textColor}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        keyboardType={keyboardType}
        editable={editable}
      />
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
  input: {
    minHeight: 60,
    height: 60,
    color: Colors.textColor,
    backgroundColor: Colors.bgBase200,
    borderColor: Colors.secondaryColor,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 15,
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
