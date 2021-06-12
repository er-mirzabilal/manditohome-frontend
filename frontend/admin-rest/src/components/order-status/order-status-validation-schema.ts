import * as yup from "yup";
export const orderStatusValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  serial: yup
    .number()
    .typeError("Serial must be number")
    .positive("Serial must be positive")
    .integer("Serial must be integer")
    .required("Serial is required"),
  color: yup.string().required("Color is required"),
});
