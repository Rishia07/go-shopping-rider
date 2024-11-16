import { Suspense, lazy } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/color";
import Loading from "../components/ui/Loading";

const DeliveryList = lazy(() => import("../components/list/DeliveryList"));

export default function DeliveryHistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Loading />}>
        <DeliveryList navigation={navigation} />
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
