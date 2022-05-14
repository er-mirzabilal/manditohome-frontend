import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@data/auth/use-register.mutation";
import Logo from "@components/ui/logo";
import Alert from "@components/ui/alert";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useUI } from "@contexts/ui.context";
import { CUSTOMER, SUPER_ADMIN } from "@utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const registerFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const RegisterForm = () => {
  const { mutate, isLoading: loading } = useRegisterMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(registerFormSchema),
  });
  const router = useRouter();
  const { authorize, closeModal, setModalView } = useUI();
  function handleNavigate(path: string) {
    router.push(`/${path}`);
    closeModal();
  }
  function onSubmit({ name, email, phone, password }: FormValues) {
    mutate(
      {
        name,
        email,
        phone,
        password,
      },
      {
        onSuccess: (data) => {
          if (
            (data?.token && data?.permissions?.includes(CUSTOMER)) ||
            data?.permissions?.includes(SUPER_ADMIN)
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
        onError: (error) => {
          const {
            response: { data },
          }: any = error ?? {};
          Object.keys(data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: data[field][0],
            });
          });
        },
      }
    );
  }
  return (
    <div className="flex flex-col justify-center w-screen h-screen px-5 py-6 bg-white sm:p-8 md:max-w-md md:h-auto">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="px-2 mt-4 text-sm leading-relaxed text-center md:text-base sm:px-0 text-body sm:mt-5 mb-7 sm:mb-10">
        By signing up, you agree to our
        <span
          onClick={() => handleNavigate("terms")}
          className="mx-1 underline cursor-pointer text-primary hover:no-underline"
        >
          terms
        </span>
        &
        <span
          onClick={() => handleNavigate("privacy")}
          className="ml-1 underline cursor-pointer text-primary hover:no-underline"
        >
          policy
        </span>
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Name"
          {...register("name")}
          type="text"
          variant="outline"
          className="mb-5"
          error={errors.name?.message}
        />
        <Input
          label="Email"
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-5"
          error={errors.email?.message}
        />
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
        />
        <div className="mt-8">
          <Button className="w-full h-12" loading={loading} disabled={loading}>
            Register
          </Button>
        </div>
      </form>
      {/* End of forgot register form */}

      <div className="relative flex flex-col items-center justify-center mt-8 mb-6 text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute left-2/4 -top-2.5 px-2 -ml-4 bg-white">
          Or
        </span>
      </div>
      <div className="text-sm text-center sm:text-base text-body">
        Already have an account?{" "}
        <button
          onClick={() => setModalView("LOGIN_VIEW")}
          className="ml-1 font-semibold underline transition-colors duration-200 text-primary focus:outline-none hover:text-primary-2 focus:text-primary-2 hover:no-underline focus:no-underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
