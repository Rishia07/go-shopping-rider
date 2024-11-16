import { Suspense, lazy } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/color";
import Loading from "../components/ui/Loading";

const ChangePasswordForm = lazy(() => import("../components/forms/ChangePasswordForm"));

export default function ChangePasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Loading />}>
        <ChangePasswordForm />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBase100,
    paddingHorizontal: 16,
  },
});
