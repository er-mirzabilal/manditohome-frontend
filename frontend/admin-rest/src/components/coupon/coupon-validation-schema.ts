import * as yup from "yup";
export const couponValidationSchema = yup.object().shape({
  code: yup.string().required("Coupon Code is required"),
  amount: yup
    .number()
    .typeError("Amount should be number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  expire_at: yup.string().required("Expire At is required"),
  active_from: yup.string().required("Active From is required"),
});
