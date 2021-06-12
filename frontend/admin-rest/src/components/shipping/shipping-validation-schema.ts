import { ShippingType } from "@ts-types/generated";
import * as yup from "yup";
export const shippingValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  amount: yup.mixed().when("type", {
    is: (value: string) => value !== ShippingType.Free,
    then: yup
      .number()
      .typeError("Amount must be number")
      .positive("Amount must be positive")
      .required("Amount is required"),
  }),
});
