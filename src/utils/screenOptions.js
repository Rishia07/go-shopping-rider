import { Colors } from "../constants/color";
import BackButton from "../components/ui/BackButton";

export const ScreenOptions = {
  headerTitleAlign: "center",
  headerTintColor: Colors.secondaryColor,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: Colors.bgBase100,
  },
  headerTitleStyle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 22,
  },
  headerLeft: () => <BackButton />,
};