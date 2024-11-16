import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { Popup } from "react-native-popup-confirm-toast";
import { Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/color";
import { logInInitialValues } from "../../constants/initialValues";
import { logInValidationSchema } from "../../utils/validationSchema";
import { loginUser } from "../../features/authSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";

export default function LoginForm({ navigation }) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");


  const handleLogIn = async (values, { resetForm }) => {
    try {
      await dispatch(loginUser(values)).unwrap();

      Popup.show({
        type: "success",
        title: "Success!",
        textBody: "You have successfully logged in.",
        buttonText: "OK",
        iconEnabled: false,
        titleTextStyle: { fontFamily: "Poppins_700Bold", textAlign: "left" },
        descTextStyle: { fontFamily: "Poppins_400Regular", textAlign: "left" },
        okButtonStyle: { backgroundColor: Colors.primaryColor },
        timing: 5000,
        callback: () => Popup.hide(),
      });
      navigation.replace("Home");
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    } finally {
      resetForm();
    }
  };

  return (
    <Formik
      initialValues={logInInitialValues}
      validationSchema={logInValidationSchema}
      onSubmit={handleLogIn}
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
            placeholder="Email"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            errorMessage={touched.email && errors.email ? errors.email : ""}
          />

          <PasswordInput
            placeholder="Password"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            errorMessage={
              touched.password && errors.password ? errors.password : ""
            }
          />

          <Button text="Login" onPress={handleSubmit} />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  errorText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    color: Colors.error400,
    fontSize: 13,
    marginTop: 12,
  },
});
