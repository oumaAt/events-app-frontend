import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "../../features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

const registerSchema = z
  .object({
    firstname: z.string().min(1, "Le prénom est requis."),
    lastname: z.string().min(1, "Le nom est requis."),
    email: z.email("Adresse e-mail invalide."),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/,
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial."
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    try {
      const result = await registerUser(userData).unwrap();
      dispatch(setCredentials({ token: result.token }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Échec de l'inscription :", err);
      const errorMessage =
        err.data?.message ||
        err.error ||
        "Une erreur est survenue lors de l'inscription.";
      alert(`Échec de l\'inscription : ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        S'inscrire
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Prénom
          </label>
          <input
            id="firstname"
            type="text"
            {...register("firstname")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            aria-invalid={errors.firstname ? "true" : "false"}
            aria-describedby={errors.firstname ? "firstname-error" : undefined}
          />
          {errors.firstname && (
            <p
              id="firstname-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nom
          </label>
          <input
            id="lastname"
            type="text"
            {...register("lastname")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            aria-invalid={errors.lastname ? "true" : "false"}
            aria-describedby={errors.lastname ? "lastname-error" : undefined}
          />
          {errors.lastname && (
            <p
              id="lastname-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.lastname.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Mot de passe
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 dark:text-gray-400 focus:outline-none"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? (
                <span>&#128065;&#x200D;&#x2B09;&#xFE0F;</span>
              ) : (
                <span>&#128065;</span>
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirmer mot de passe
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 dark:text-gray-400 focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? "Masquer la confirmation du mot de passe"
                  : "Afficher la confirmation du mot de passe"
              }
            >
              {showConfirmPassword ? (
                <span>&#128065;&#x200D;&#x2B09;&#xFE0F;</span>
              ) : (
                <span>&#128065;</span>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
          aria-live="polite"
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
        {isSuccess && (
          <p className="mt-4 text-center text-green-600 dark:text-green-400">
            Inscription réussie !
          </p>
        )}
        {isError && (
          <p className="mt-4 text-center text-red-600 dark:text-red-400">
            Erreur : {error.data?.message || "Échec de l'inscription."}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
