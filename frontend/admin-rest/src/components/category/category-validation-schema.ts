import * as yup from "yup";
export const categoryValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.object().required("Type is required"),
});
