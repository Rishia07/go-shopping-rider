import * as Yup from "yup";

export const logInValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const editPersonalInfoValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First Name must be at least 3 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .required("Last Name is required"),
  phoneNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(
      /^09\d{9}$/,
      "Mobile Number must be 11 digits long and start with 09"
    ),
  vehicle: Yup.string().required("Vehicle is required"),
  plateNumber: Yup.string().required("Plate Number is required"),
});

export const changeEmailValidationSchema = Yup.object({
  newEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const changePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

