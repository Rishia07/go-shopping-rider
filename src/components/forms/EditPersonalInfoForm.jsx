import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { View, Text, StyleSheet } from "react-native";
import { Popup } from "react-native-popup-confirm-toast";
import { Colors } from "../../constants/color";
import { editPersonalInfoValidationSchema } from "../../utils/validationSchema";
import { updateUserInfo } from "../../features/authSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function EditPersonalInfoForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [errorMessage, setErrorMessage] = useState("");

  const editPersonalInfoInitialValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    vehicle: user?.vehicle || "",
    plateNumber: user?.plateNumber || "",
  };

  const handleEditInfo = async (values) => {
    try {
      await dispatch(updateUserInfo(values)).unwrap();

      Popup.show({
        type: "success",
        title: "Success!",
        textBody: "Your personal information has been successfully updated.",
        buttonText: "OK",
        iconEnabled: false,
        titleTextStyle: { fontFamily: "Poppins_700Bold", textAlign: "left" },
        descTextStyle: { fontFamily: "Poppins_400Regular", textAlign: "left" },
        okButtonStyle: { backgroundColor: Colors.primaryColor },
        timing: 5000,
        callback: () => Popup.hide(),
      });
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <Formik
      initialValues={editPersonalInfoInitialValues}
      validationSchema={editPersonalInfoValidationSchema}
      onSubmit={handleEditInfo}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <>
          <Input
            placeholder="First Name"
            onChangeText={handleChange("firstName")}
            onBlur={handleBlur("firstName")}
            value={values.firstName}
            errorMessage={
              touched.firstName && errors.firstName ? errors.firstName : ""
            }
          />

          <Input
            placeholder="Last Name"
            onChangeText={handleChange("lastName")}
            onBlur={handleBlur("lastName")}
            value={values.lastName}
            errorMessage={
              touched.lastName && errors.lastName ? errors.lastName : ""
            }
          />

          <Input
            placeholder="Phone Number"
            keyboardType="numeric"
            maxLength={11}
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            value={values.phoneNumber}
            errorMessage={
              touched.phoneNumber && errors.phoneNumber
                ? errors.phoneNumber
                : ""
            }
          />

          <Input
            placeholder="Vehicle"
            onChangeText={handleChange("vehicle")}
            onBlur={handleBlur("vehicle")}
            value={values.vehicle}
            errorMessage={
              touched.vehicle && errors.vehicle ? errors.vehicle : ""
            }
          />

          <Input
            placeholder="Plate Number"
            onChangeText={handleChange("plateNumber")}
            onBlur={handleBlur("plateNumber")}
            value={values.plateNumber}
            errorMessage={
              touched.plateNumber && errors.plateNumber
                ? errors.plateNumber
                : ""
            }
          />

          <View style={styles.space} />

          <Button text="Save" onPress={handleSubmit} />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  space: {
    height: 20,
    width: "100%",
  },
  errorText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    color: Colors.error400,
    fontSize: 13,
    marginTop: 12,
  },
});
