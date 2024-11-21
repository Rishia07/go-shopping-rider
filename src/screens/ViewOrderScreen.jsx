import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from "react-native";
import { Colors } from "../constants/color";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder, getOrderById, getTodaysOrderCountForRider } from "../api/ordersApi";
import Loading from "../components/ui/Loading";
import { Popup } from "react-native-popup-confirm-toast";
import * as SecureStore from "expo-secure-store";
import { storage } from "../config/firebaseConfig.js";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ViewOrderScreen({ route }) {
  const { item } = route.params;
  const queryClient = useQueryClient();

  const [timeLeft, setTimeLeft] = useState(null);
  const [delayComment, setDelayComment] = useState("");
  const [firstWarningShown, setFirstWarningShown] = useState(false);
  const [secondWarningShown, setSecondWarningShown] = useState(false);
  const [penaltyApplied, setPenaltyApplied] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["order", item._id],
    queryFn: () => getOrderById(item._id),
    refetchInterval: 5000,
    staleTime: 10000,
    initialData: item,
  });
  console.log("wpw", orderData?.proofOfDelivery)

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

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          notifyRiderExceeded();
          setPenaltyApplied(true);
          return 0;
        }

        if (prevTime === Math.floor(20 * 60 / 2) && !firstWarningShown) {
          alert("First Warning: Half the time has passed!");
          setFirstWarningShown(true);
        }

        if (prevTime === 5 * 60 && !secondWarningShown) {
          alert("Second Warning: Only 5 minutes remaining!");
          setSecondWarningShown(true);
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startDeliveryTimer = () => {
    const deliveryTimeLimit = 20 * 60;
    setTimeLeft(deliveryTimeLimit);
    setFirstWarningShown(false);
    setSecondWarningShown(false);
    setPenaltyApplied(false);
  };

  const notifyRiderExceeded = () => {
    alert(`Notification: Time Limit Exceeded for Delivery 🚨

We noticed that the delivery time has exceeded the maximum limit for this order. Please provide a reason for the delay. This helps us ensure quality service for all orders. A penalty has been applied as per policy.

Thank you for your cooperation.`);
    setPenaltyApplied(true);
  };

  const handleOrderStatus = (newStatus) => {
    Popup.show({
      type: "confirm",
      title: newStatus === "To Ship" ? "Accept Order" : "Update Order Status",
      textBody: `Are you sure you want to ${newStatus === "To Ship"
        ? "accept this order"
        : `update the status to ${newStatus}`
        }`,
      buttonText: "Yes",
      confirmText: "No",
      iconEnabled: false,
      titleTextStyle: { fontFamily: "Poppins_700Bold", textAlign: "left" },
      descTextStyle: { fontFamily: "Poppins_400Regular", textAlign: "left" },
      okButtonStyle: { backgroundColor: Colors.primaryColor },
      buttonContentStyle: { flexDirection: "row-reverse" },
      callback: async () => {
        if (newStatus === "To Ship") {
          const { orderCount } = await getTodaysOrderCountForRider();
          console.log(orderCount);
          // Check if the quota has been reached
          if (orderCount >= 10) {
            Popup.hide();
            alert("You have reached your maximum daily order quota of 10.");
            return;
          }
        }
        updateMutation.mutate({ id: orderData._id, status: newStatus });
        Popup.hide();
        if (newStatus === "To Ship") {
          startDeliveryTimer();
        }
      },
      cancelCallback: () => {
        Popup.hide();
      },
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes ${secs} seconds`;
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.assets[0].uri) {
      console.log("No URI found for the selected image.");
      Alert.alert("Image Error", "Selected image is invalid. Please try again.");
      return; // Exit if no URI is found
    } else if (result.canceled) {
      console.log("No image selected");
      Alert.alert("No Image", "You have not selected any image.");
      return; // Exit the function since no image was chosen
    } else {
      console.log("yahoo")

      setUploading(true)

      console.log("blob")
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.assets[0].uri, true);
        xhr.send(null);
      });

      console.log(blob)
      const imageRef = storageRef(storage, "user/proofOfDelivery");

      console.log(imageRef)
      const snapshot = uploadBytes(imageRef, blob);
      console.log(snapshot)
      snapshot
        .then(() => {
          setUploading(false);
        })
        .catch((error) => {
          setUploading(false);
          console.log(error);
          return;
        });

      snapshot.then(async () => {
        const url = await getDownloadURL(imageRef);
        const token = await SecureStore.getItemAsync("token");

        console.log("put")
        await axios.put(
          `https://go-shopping-api-mauve.vercel.app/api/orders/${orderData?._id}`,
          {
            proofOfDelivery: url,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("updateuser")
        // await updateUser({
        //   profilePic: url,
        // });

        console.log("setImage")
        setImage(url);
      });
      return
    }
  }
  const proofOfDeliveryUrl =
    image || (orderData?.proofOfDelivery && orderData?.proofOfDelivery !== "s" ? orderData.proofOfDelivery : null);

  if (isLoading) return <Loading />;

  const userAddress = orderData?.user?.address;
  const formattedAddress = userAddress
    ? `${userAddress.houseNumber} ${userAddress.street}, ${userAddress.barangay}, ${userAddress.municipality}, ${userAddress.province}, ${userAddress.country}`
    : "Address not available";

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.orderId}>Order ID: {orderData?._id}</Text>

        <Text style={styles.title}>Product Details</Text>
        <Text style={styles.productName}>
          {orderData?.product ? orderData?.product.title : "No Title Available"}
        </Text>
        <Text style={styles.price}>
          Price: ₱{(parseFloat(orderData?.price) + 65).toFixed(2)} (65 Pesos Delivery Fee Included)
        </Text>
        <Text style={styles.quantity}>Quantity: {orderData?.quantity}</Text>

        <Text style={styles.title}>Customer Details</Text>
        <Text style={styles.customerName}>
          {`${orderData?.user ? orderData?.user.firstName : "Unknown"} ${orderData?.user ? orderData?.user.lastName : ""
            }`}
        </Text>
        <Text style={styles.address}>{formattedAddress}</Text>

        <Text style={styles.title}>Order Status</Text>
        <Text style={[styles.status, orderData?.status === "Delivered" && { color: "green" }]}>
          {orderData?.status}
        </Text>

        <View style={styles.buttonContainer}>
          {orderData?.status === "Pending" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus("To Ship")}
            >
              <Text style={styles.buttonText}>Accept Delivery</Text>
            </TouchableOpacity>
          )}

          {orderData?.status === "To Ship" && (
            <>
              <Text style={styles.timer}>
                {timeLeft !== null ? `Time Left: ${formatTime(timeLeft)}` : "Delivery in progress..."}
              </Text>
              <TouchableOpacity
                style={[styles.button, !image && styles.disabledButton]}
                onPress={() => handleOrderStatus("Delivered")}
                disabled={!image} // Disable if no image is uploaded
              >
                <Text style={styles.buttonText}>Delivered</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => uploadImage()}
              >
                <Text style={styles.buttonText}>Upload Proof of Delivery</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.imageContainer}>
          {proofOfDeliveryUrl && (<Image source={{
            uri: proofOfDeliveryUrl,
          }} style={styles.image}
            resizeMode="contain" />)}
        </View>
      </View>
    </ScrollView>
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
    alignItems: "center", // Center the image horizontally
    justifyContent: "center", // Center the image vertically if needed
    marginBottom: 20, // Space below the image
    marginTop: 20, // Space below the image
  },
  image: {
    width: "100%", // Allow image to scale within its container
    height: undefined, // Make height depend on aspect ratio
    aspectRatio: 1, // Default to square until image loads
    borderRadius: 12, // Optional: rounded corners
  },
  disabledButton: {
    backgroundColor: "#EFEFEF", // A lighter color to indicate disabled state
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  orderId: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.textColor,
    marginVertical: 10,
  },
  productName: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 5,
  },
  price: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 5,
  },
  quantity: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 10,
  },
  customerName: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 5,
  },
  address: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 10,
  },
  status: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 10,
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
  timer: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: Colors.textColor,
    marginVertical: 10,
  },
  commentInput: {
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: Colors.bgBase100,
  },
  buttonContainer: {
    flexDirection: "column", // Change to column layout
    alignItems: "center",
    gap: 10, // Add space between buttons (React Native 0.71+)
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    width: "80%", // Adjust button width to be consistent
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
  },
  timer: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: Colors.textColor,
    marginVertical: 10,
  },
});