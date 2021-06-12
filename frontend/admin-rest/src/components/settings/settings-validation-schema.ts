import * as yup from "yup";
export const settingsValidationSchema = yup.object().shape({
  currency: yup.object().required("Currency is required"),
});
