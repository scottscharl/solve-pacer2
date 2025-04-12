import React, { useState } from "react";
import { usePocket } from "@hooks";
import { Link, useNavigate } from "react-router-dom";
import Button from "@components/Button";

export default function Signup() {
  let navigate = useNavigate();
  const { register } = usePocket();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await register(email, password, passwordConfirm);
      // console.log(await res);
      navigate("/user"); // Navigate to user page after signup
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            className="p-2 bg-gray-700 border border-gray-600 rounded outline-none placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            className="p-2 bg-gray-700 border border-gray-600 rounded outline-none placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="passwordConfirm" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            className="p-2 bg-gray-700 border border-gray-600 rounded outline-none placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            type="password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col mt-6 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Button
            type="submit"
            variant="primary"
            className="w-full px-4 py-2 font-medium transition-colors bg-green-600 rounded sm:w-auto hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>

          <div className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-400 hover:text-green-300"
            >
              Log in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
