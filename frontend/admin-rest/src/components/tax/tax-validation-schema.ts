import * as yup from "yup";
export const taxValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  rate: yup
    .number()
    .typeError("Rate must be number")
    .positive("Rate must be positive")
    .integer("Rate must be integer")
    .required("Rate is required"),
});
