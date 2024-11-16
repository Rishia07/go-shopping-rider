import { useState } from "react";
import { Formik } from "formik";
import { View, Text, StyleSheet } from "react-native";
import { Popup } from "react-native-popup-confirm-toast";
import { Colors } from "../../constants/color";
import { changePasswordValidationSchema } from "../../utils/validationSchema";
import { changePasswordInitialValues } from "../../constants/initialValues";
import { useDispatch } from "react-redux"; // Add useDispatch
import { updatePassword } from "../../features/authSlice"; // Fixed the import
import Button from "../ui/Button";
import PasswordInput from "../ui/PasswordInput";

export default function ChangePasswordForm() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async (values, { resetForm }) => {
    try {
      await dispatch(updatePassword(values)).unwrap();

      Popup.show({
        type: "success",
        title: "Success!",
        textBody: "Your password has been successfully changed.",
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
    } finally {
      resetForm();
    }
  };

  return (
    <Formik
      initialValues={changePasswordInitialValues}
      validationSchema={changePasswordValidationSchema}
      onSubmit={handleChangePassword}
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
          <PasswordInput
            placeholder="Current Password"
            onChangeText={handleChange("oldPassword")}
            onBlur={handleBlur("oldPassword")}
            value={values.oldPassword}
            errorMessage={
              touched.oldPassword && errors.oldPassword ? errors.oldPassword : ""
            }
          />
          <PasswordInput
            placeholder="New Password"
            onChangeText={handleChange("newPassword")}
            onBlur={handleBlur("newPassword")}
            value={values.newPassword}
            errorMessage={
              touched.newPassword && errors.newPassword ? errors.newPassword : ""
            }
          />
          <PasswordInput
            placeholder="Confirm New Password"
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            value={values.confirmPassword}
            errorMessage={
              touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""
            }
          />

          <View style={styles.space} />

          <Button text="Save" onPress={handleSubmit} />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
