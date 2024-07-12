import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/auth/auth.module.scss";
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
import { signIn } from "../../utils/api/auth";
import { isNotEmpty, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { Notification, rem } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setEmail,
  setId,
  setPermission,
  setRefreshToken,
  setUsername,
} from "../../store/slices/authSlice";
import { RootState } from "../../store";

const Login = () => {
  //Mobile version set to 835px
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
  const dispatch = useDispatch();
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: isNotEmpty("Invalid Password"),
    },
  });

  const handleLogin = () => {
    if (loginForm.values.email && loginForm.values.password) {
      signIn(loginForm.values.email, loginForm.values.password)
        .then((res) => {
          console.log(res);
          if (res.data.isAdmin) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }

          dispatch(setEmail(res.data.email));
          dispatch(setPermission(res.data.isAdmin));
          dispatch(setAccessToken(res.data.accessToken));
          dispatch(setRefreshToken(res.data.refreshToken));
          dispatch(setId(res.data._id));
          dispatch(setUsername(res.data.username));
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
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );

  console.log(refreshToken);
  return (
    <form onSubmit={loginForm.onSubmit(() => handleLogin())}>
      <div className={styles.container}>
        <Text className={styles.mainTitle} style={{ marginBottom: "3rem" }}>
          Car Booking Systems
        </Text>
        <Text className={styles.subTitle} style={{ marginBottom: "3rem" }}>
          Login
        </Text>
        <TextInput
          style={{ marginBottom: "3rem" }}
          placeholder="Email"
          styles={{
            input: { padding: "1.5rem 1rem", borderRadius: "10px" },
          }}
          w={!isMobile ? "40%" : "90%"}
          {...loginForm.getInputProps("email")}
        />
        <PasswordInput
          style={{ marginBottom: "3rem" }}
          placeholder="Password"
          styles={{ input: { padding: "1.5rem 1rem", borderRadius: "10px" } }}
          w={!isMobile ? "40%" : "90%"}
          {...loginForm.getInputProps("password")}
        />
        <Button
          type="submit"
          disabled={loginForm.values.password.length <= 0}
          w={!isMobile ? "40%" : "90%"}
          size="lg"
          style={{ marginBottom: "1rem" }}
          styles={{ root: { borderRadius: "10px" } }}
        >
          Login
        </Button>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <Text fw={500}>Forgotten Password? </Text>
          <Text
            fw={700}
            onClick={() => {
              navigate("/forgetPwd");
            }}
            style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
          >
            Reset Password
          </Text>
        </span>
        <Divider w={!isMobile ? "40%" : "90%"} m={"1rem 0 3rem 0"} />
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <Text fw={500}>Don't have an account yet? </Text>
          <Text
            fw={700}
            onClick={() => {
              navigate("/signup");
            }}
            style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
          >
            Register
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
              Please check your login credentials
            </Text>
          </Group>
        </Dialog>
      </div>
    </form>
  );
};

export default Login;
