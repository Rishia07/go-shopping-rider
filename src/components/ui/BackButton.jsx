import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/color";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BackButton() {
  const navigation = useNavigation();
  return (
    <Ionicons
      name="chevron-back-outline"
      color={Colors.secondaryColor}
      size={30}
      onPress={() => navigation.goBack()}
    />
  );
}
