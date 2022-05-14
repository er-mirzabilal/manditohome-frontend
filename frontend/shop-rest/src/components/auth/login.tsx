import React, { useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@data/auth/use-login.mutation";
import Logo from "@components/ui/logo";
import Alert from "@components/ui/alert";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useUI } from "@contexts/ui.context";
import { CUSTOMER, SUPER_ADMIN, RECEPTIONIST } from "@utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  // email: string;
  phone: string;
  password: string;
};

const loginFormSchema = yup.object().shape({
  // email: yup.string().email("Email is not valid").required("Email is required"),
  phone: yup.string().required("Phone Number is required"),
  password: yup.string().required("Password is required"),
});

const defaultValues = {
  phone: "",
  password: "",
};

const LoginForm = () => {
  const { mutate: login, isLoading: loading } = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const { authorize, setModalView } = useUI();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(loginFormSchema),
    defaultValues,
  });

  function onSubmit({ phone, password }: FormValues) {
    login(
      {
        phone,
        password,
      },
      {
        onSuccess: (data) => {
          if (
            data?.token &&
            (data?.permissions?.includes(CUSTOMER) || data?.permissions?.includes(RECEPTIONIST) ||
              data?.permissions?.includes(SUPER_ADMIN))
          ) {
            Cookies.set("auth_token", data.token);
            Cookies.set("auth_permissions", data.permissions);
            authorize();
            return;
          }
          if (!data.token) {
            setErrorMsg("The credentials was wrong!");
            return;
          }
          if (!data.permissions.includes(CUSTOMER)) {
            setErrorMsg("Doesn't have enough permission");
            return;
          }
        },
      }
    );
  }
  return (
    <div className="flex flex-col justify-center w-screen h-screen px-5 py-6 bg-white sm:p-8 md:max-w-md md:h-auto">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-4 mb-8 text-sm text-center md:text-base text-body sm:mt-5 sm:mb-10">
        Login with your email & password
      </p>
      {errorMsg && (
        <Alert
          variant="error"
          message={errorMsg}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg("")}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <Input
          label="Email"
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-5"
          error={errors.email?.message}
        /> */}
         <Input
          label="Phone Number"
          {...register("phone")}
          type="text"
          variant="outline"
          className="mb-5"
          error={errors.phone?.message}
        />
        <PasswordInput
          label="Password"
          {...register("password")}
          error={errors.password?.message}
          variant="outline"
          className="mb-5"
          forgotPageRouteOnClick={() => setModalView("FORGOT_VIEW")}
        />
        <div className="mt-8">
          <Button
            className="w-full h-11 sm:h-12"
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </div>
      </form>
      {/* End of forgot login form */}

      <div className="relative flex flex-col items-center justify-center mt-8 mb-6 text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute left-2/4 -top-2.5 px-2 -ml-4 bg-white">
          Or
        </span>
      </div>
      <div className="text-sm text-center sm:text-base text-body">
        Don't have any account?{" "}
        <button
          onClick={() => setModalView("REGISTER")}
          className="ml-1 font-semibold underline transition-colors duration-200 text-primary focus:outline-none hover:text-primary-2 focus:text-primary-2 hover:no-underline focus:no-underline"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
