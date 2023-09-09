"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { data } from "autoprefixer";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  //isLoading == disabled prop which is passed to children component
  const [isLoading, setIsLoading] = useState(false);

  //manage input form state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //get data input filed (name, email, password) via handleSubmit of useForm
  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    //disabled == true ==> user cannot interact
    setIsLoading(true);

    signIn("credentials", { ...data, redirect: false }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("Login successful!");
        router.refresh(); //refresh current page
        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const toggleLoginToRegister = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, []);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account" />
      <Input
        id="email"
        label="Email"
        register={register}
        errors={errors}
        required
        disabled={isLoading}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="hover:bg-neutral-400 rounded-lg">
        <Button
          outline
          label="Continue with Google"
          onClick={() => signIn("google")}
          icon={FcGoogle}
        />
      </div>
      <div className="hover:bg-neutral-400 rounded-lg">
        <Button
          outline
          label="Continue with Github"
          onClick={() => signIn("github")}
          icon={AiFillGithub}
        />
      </div>
      <div
        className="flex flex-row items-center justify-center gap-2 
      text-neutral-500 mt-2 font-light"
      >
        <div>First time using Gobnb?</div>
        <div
          onClick={toggleLoginToRegister}
          className="text-neutral-800 cursor-pointer hover:underline"
        >
          Create an account
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Continue"
      title="Login"
      disabled={isLoading}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
