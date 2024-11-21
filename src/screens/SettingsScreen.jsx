import { useDispatch, useSelector } from "react-redux";
import { Popup } from "react-native-popup-confirm-toast";

import { useState, useEffect } from "react";
import { Colors } from "../constants/color";
import { updateUserInfo } from "../features/authSlice";
import { ref as storageRef, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebaseConfig";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import AccountSettingList from "../components/ui/AccountSettingList";
import DefaultPic from "../assets/default-profile.jpg";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoadingScreen from "./LoadingScreen";
import { editInfo } from "../api/authApi";
import ErrorText from "../components/ui/ErrorText";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Popup.show({
        type: "danger",
        title: "Permission Required",
        textBody: "Permission to access camera roll is required!",
        buttonText: "OK",
        iconEnabled: false,
        titleTextStyle: { fontFamily: "Poppins_700Bold", textAlign: "left" },
        descTextStyle: { fontFamily: "Poppins_400Regular", textAlign: "left" },
        okButtonStyle: { backgroundColor: Colors.error400 },
        timing: 5000,
        callback: () => Popup.hide(),
      });
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      const imageUri = selectedImage.uri;

      Popup.show({
        type: "confirm",
        title: "Change Profile Picture",
        textBody: "Do you want to change your profile picture?",
        buttonText: "OK",
        cancelButtonText: "Cancel",
        iconEnabled: false,
        titleTextStyle: { fontFamily: "Poppins_700Bold", textAlign: "left" },
        descTextStyle: { fontFamily: "Poppins_400Regular", textAlign: "left" },
        okButtonStyle: { backgroundColor: Colors.primaryColor },
        callback: async () => {
          
          setUploading(true)
          console.log("Eyos")
          const response = await fetch(imageUri);
          console.log(response)
          const blob = await response.blob();
          console.log(blob)
          console.log("test")

          const imageRef = storageRef(storage, "rider/profilePic");
          console.log("test2")
          
          console.log("ImageRef", imageRef)
          const snapshot = uploadBytes(imageRef, blob);
          console.log("Snapshot", snapshot)
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
                  const userId = await SecureStore.getItemAsync("userId");
                  const token = await SecureStore.getItemAsync("token");
                  
                  console.log(url)
                  console.log("put")
                  await axios.put(
                    `https://go-shopping-api-mauve.vercel.app/api/riders/${userId}`,
                    {
                      profilePic: url,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
  
                  console.log("updateuser")
                  await editInfo({
                    profilePic: url,
                  });
  
                  console.log("setImage")
                  setImage(url);
                });

          // const url = await getDownloadURL(snapshot.ref);

          // await dispatch(updateUserInfo({ profilePic: url }));



          Popup.hide();
        },
        cancelCallback: () => {
          Popup.hide();
          },
      });
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorText error={error.message || "An error occurred"} />;

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image
          style={styles.profilePic}
          source={{
            uri:
              image ||
              (user && user.profilePic) ||
              "https://i.stack.imgur.com/l60Hf.png",
          }}
        />
        <Pressable style={styles.editBtn} onPress={pickImage}>
          <Ionicons name="pencil" color={Colors.secondaryColor} size={25} />
        </Pressable>
      </View>
      <Text style={styles.username}>
        {`${user?.firstName} ${user?.lastName}` || "User"}
      </Text>
      <Text style={styles.email}>{user?.email || ""}</Text>
      <Text style={styles.phoneNumber}>+63{user?.phoneNumber.startsWith('0')
          ? user?.phoneNumber.slice(1)
          : user?.phoneNumber}</Text>
      <AccountSettingList navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.bgBase100,
    paddingHorizontal: 16,
  },
  profilePicContainer: {
    position: "relative",
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginBottom: 20,
    backgroundColor: Colors.secondaryColor,
    borderColor: Colors.secondaryColor,
    borderWidth: 2,
    shadowColor: Colors.secondaryColor,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgBase100,
    borderColor: Colors.secondaryColor,
    borderWidth: 2,
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  username: {
    fontSize: 20,
    color: Colors.dark,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },
  email: {
    fontSize: 18,
    color: Colors.textColor,
    fontFamily: "Poppins_500Medium",
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: "Poppins_500Medium",
    marginBottom: 40,
  },
});
