import { Text, StyleSheet, Pressable, FlatList, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../api/ordersApi";
import Loading from "../ui/Loading";
import ErrorText from "../ui/ErrorText";
import { formatAddress } from "../../utils/formatAddress";
import { Colors } from "../../constants/color";

export default function OrdersList({ navigation }) {
  const {
    data: orders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
    staleTime: 10000,
  });

  // Filter out orders that are not "Pending" or "To Ship"
  const filteredItems = Array.isArray(orders)
    ? orders.filter(
        (order) =>
          !order?.rider && // Only include orders without a rider
          (order.status === "Pending" || order.status.toLowerCase() === "to ship")
      )
    : [];

  // Adding a check for orders that have riders but are not delivered
  const acceptedOrders = orders.filter(
    (order) =>
      order.rider && 
      (order.status.toLowerCase() !== "received" && order.status.toLowerCase() !== "completed" && order.status.toLowerCase() !== "delivered")
  );

  // Combine both filtered items and accepted orders
  const allVisibleOrders = [...filteredItems, ...acceptedOrders];

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
          {item.user ? formatAddress(item.user.address) : "Unknown"}
        </Text>
      </View>
    </Pressable>
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorText error={error.message || "An error occurred"} />;

  return (
    <FlatList
      data={allVisibleOrders} // Use combined orders
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={styles.noOrdersText}>No orders available</Text>
      }
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
  noOrdersText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});