import { Text, StyleSheet, Pressable, FlatList, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchDelivery } from "../../api/authApi";
import Loading from "../ui/Loading";
import ErrorText from "../ui/ErrorText";
import { formatAddress } from "../../utils/formatAddress";
import { Colors } from "../../constants/color";

export default function DeliveryList({ navigation }) {
  const {
    data: delivery = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["delivery"],
    queryFn: fetchDelivery,
  });

  const filteredItems = Array.isArray(delivery) ? delivery : [];

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.row}
      onPress={() => navigation.push("ViewOrder", { item: item })}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {item.product ? item.product.title : "No Title Available"}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>₱{item.price}</Text>
          <Text style={styles.quantity}>{item.quantity}</Text>
        </View>
        <Text style={styles.userName}>
          {`${item.user ? item.user.firstName : "Unknown"} ${
            item.user ? item.user.lastName : ""
          }`}
        </Text>
        <Text style={styles.address}>
          {`${item.user ? formatAddress(item.user.address) : "Unknown"}`}
        </Text>
      </View>
    </Pressable>
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorText error={error.message || "An error occurred"} />;

  return (
    <FlatList
      data={filteredItems}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.bgBase100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    color: Colors.textColor,
    fontFamily: "Poppins_600SemiBold",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: "Poppins_500Medium",
  },
  quantity: {
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: "Poppins_500Medium",
  },
  userName: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: "Poppins_400Regular",
  },
  address: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.textColor,
    fontFamily: "Poppins_400Regular",
  },
});
