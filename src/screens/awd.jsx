import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../constants/color";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder, getOrderById } from "../api/ordersApi";
import Loading from "../components/ui/Loading";
import { Popup } from "react-native-popup-confirm-toast";

export default function ViewOrderScreen({ route }) {
  const { item } = route.params;
  const queryClient = useQueryClient();

  const [proofImage, setProofImage] = useState(null); // Proof of payment image
  const [timeLeft, setTimeLeft] = useState(null);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["order", item._id],
    queryFn: () => getOrderById(item._id),
    refetchInterval: 5000,
    staleTime: 10000,
    initialData: item,
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["order", id]);
      const previousOrder = queryClient.getQueryData(["order", id]);
      queryClient.setQueryData(["order", id], (oldOrder) => ({
        ...oldOrder,
        status,
      }));
      return { previousOrder };
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(["order", id], context.previousOrder);
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries(["order", id]);
    },
  });

  const handleProofImageSelection = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProofImage(result.assets[0]);
    }
  };

  const handleOrderStatus = (newStatus) => {
    if (newStatus === "Delivered" && !proofImage) {
      Popup.show({
        type: "confirm",
        title: "Proof of Payment",
        textBody: "Please upload proof of payment before marking this order as delivered.",
        buttonText: "Upload",
        confirmText: "Cancel",
        callback: handleProofImageSelection,
      });
      return;
    }

    Popup.show({
      type: "confirm",
      title: "Update Order Status",
      textBody: `Are you sure you want to update the status to ${newStatus}?`,
      buttonText: "Yes",
      confirmText: "No",
      callback: async () => {
        updateMutation.mutate({ id: orderData._id, status: newStatus });
        setProofImage(null); // Reset proof image
        Popup.hide();
      },
      cancelCallback: () => {
        Popup.hide();
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <Text style={styles.orderId}>Order ID: {orderData?._id}</Text>

      <Text style={styles.title}>Product Details</Text>
      <Text style={styles.productName}>
        {orderData?.product ? orderData?.product.title : "No Title Available"}
      </Text>
      <Text style={styles.price}>Price: ₱{orderData?.price}</Text>
      <Text style={styles.quantity}>Quantity: {orderData?.quantity}</Text>

      {proofImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: proofImage.uri }} style={styles.image} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {orderData?.status === "To Ship" && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus("Delivered")}
            >
              <Text style={styles.buttonText}>Delivered</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBase100,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
  },
});
