import { Suspense, lazy } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/color";
import Loading from "../components/ui/Loading";

const EditPersonalInfoForm = lazy(() => import("../components/forms/EditPersonalInfoForm"));

export default function EditPersonalInfoScreen() {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Loading />}>
        <EditPersonalInfoForm />
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
