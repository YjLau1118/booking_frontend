import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/auth/auth.module.scss";
import { useNavigate } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Button,
  Dialog,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { signUp } from "../../utils/api/auth";

const SignUp = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const handleWindowSizeChange = () => {
    setWidth(typeof window !== "undefined" ? window.innerWidth : 0);
  };

  useEffect(() => {
    if (width <= 835) {
      setIsMobile(true);
    } else setIsMobile(false);
  }, [width]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowSizeChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleWindowSizeChange);
      }
    };
  }, [width]);

  const navigate = useNavigate();
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const signupForm = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmpwd: "",
      phone: "",
    },

    validate: {
      username: isNotEmpty("Username cannot be null"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: isNotEmpty("Invalid Password"),
      phone: isNotEmpty("Phone number must not be null"),
    },
  });

  const handleSignUp = () => {
    if (
      signupForm.values.username &&
      signupForm.values.email &&
      signupForm.values.password &&
      signupForm.values.phone
    ) {
      signUp(
        signupForm.values.username,
        signupForm.values.email,
        signupForm.values.password,
        signupForm.values.phone
      )
        .then((res) => {
          console.log(res);
          setOpenSuccess(true);
          setTimeout(() => {
            setOpenSuccess(false);
            navigate("/login");
          }, 3000);
        })
        .catch((err: any) => {
          setOpenError(true);
          setError(err.message);
          setTimeout(() => {
            setOpenError(false);
            setError("");
          }, 5000);
        });
    }
  };

  const validatePassword = (a: string, b: string) => {
    return !(a === b);
  };

  return (
    <form onSubmit={signupForm.onSubmit(() => handleSignUp())}>
      <div className={styles.container}>
        <Text className={styles.mainTitle} style={{ marginBottom: "3rem" }}>
          Car Booking Systems
        </Text>
        <Text className={styles.subTitle} style={{ marginBottom: "3rem" }}>
          Register
        </Text>
        <TextInput
          style={{ marginBottom: "2rem" }}
          placeholder="Username"
          styles={{
            input: { padding: "1.5rem 1rem", borderRadius: "10px" },
          }}
          w={!isMobile ? "40%" : "90%"}
          {...signupForm.getInputProps("username")}
        />
        <TextInput
          style={{ marginBottom: "2rem" }}
          placeholder="Email"
          styles={{
            input: { padding: "1.5rem 1rem", borderRadius: "10px" },
          }}
          w={!isMobile ? "40%" : "90%"}
          {...signupForm.getInputProps("email")}
        />
        <PasswordInput
          style={{ marginBottom: "2rem" }}
          placeholder="Password"
          styles={{ input: { padding: "1.5rem 1rem", borderRadius: "10px" } }}
          w={!isMobile ? "40%" : "90%"}
          {...signupForm.getInputProps("password")}
        />
        <PasswordInput
          style={{ marginBottom: "2rem" }}
          placeholder="Confirm Password"
          styles={{ input: { padding: "1.5rem 1rem", borderRadius: "10px" } }}
          w={!isMobile ? "40%" : "90%"}
          onChange={(e) => {
            signupForm.setFieldValue("confirmpwd", e.currentTarget.value);
          }}
          error={
            signupForm.values.confirmpwd !== signupForm.values.password &&
            "Passwords do not match"
          }
        />
        <TextInput
          style={{ marginBottom: "2rem" }}
          placeholder="Phone Number"
          styles={{
            input: { padding: "1.5rem 1rem", borderRadius: "10px" },
          }}
          w={!isMobile ? "40%" : "90%"}
          {...signupForm.getInputProps("phone")}
        />
        <Button
          type="submit"
          disabled={
            !signupForm.isValid("password") ||
            signupForm.values.password.length <= 0 ||
            validatePassword(
              signupForm.values.password,
              signupForm.values.confirmpwd
            )
          }
          w={!isMobile ? "40%" : "90%"}
          size="lg"
          style={{ marginBottom: "1rem" }}
          styles={{ root: { borderRadius: "10px" } }}
        >
          Register
        </Button>
        <Divider w={!isMobile ? "40%" : "90%"} m={"1rem 0 3rem 0"} />
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <Text fw={500}>Already have an account? </Text>
          <Text
            fw={700}
            onClick={() => {
              navigate("/login");
            }}
            style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
          >
            Login
          </Text>
        </span>
        <Dialog
          opened={openError}
          withCloseButton
          onClose={() => setOpenError(false)}
          size="lg"
          radius="md"
        >
          <Text size="sm" mb="xs" fw={700} c={"red"}>
            {error}
          </Text>
          <Group align="flex-end">
            <Text size="sm" fw={500}>
              Please check your sign up credentials
            </Text>
          </Group>
        </Dialog>
        <Dialog
          opened={openSuccess}
          withCloseButton
          onClose={() => setOpenSuccess(false)}
          size="lg"
          radius="md"
        >
          <Text size="sm" mb="xs" fw={700} c={"green"}>
            Register Successfully
          </Text>
          <Group align="flex-end">
            <Text size="sm" fw={500}>
              You will redirect to login page, please wait awhile.
            </Text>
          </Group>
        </Dialog>
      </div>
    </form>
  );
};

export default SignUp;
