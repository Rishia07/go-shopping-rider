import { StyleSheet, View, Text, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../../constants/color";

export default function Select({
  selectedValue,
  onValueChange,
  errorMessage,
  items,
}) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.pickerContainer, errorMessage && styles.pickerError]}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            onValueChange(itemValue);
          }}
          style={styles.picker}
          dropdownIconColor={Colors.secondaryColor}
        >
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              style={styles.picker}
            />
          ))}
        </Picker>
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  pickerContainer: {
    minHeight: 60,
    height: 60,
    backgroundColor: Colors.bgBase200,
    borderColor: Colors.secondaryColor,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  pickerError: {
    borderColor: Colors.error400,
  },
  picker: {
    color: Colors.secondaryColor,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_500Medium",
  },
  errorText: {
    color: Colors.error400,
    fontSize: 12,
    marginTop: 5,
  },
});
