import React, { useEffect } from "react";
import { useState } from "react";
import {
  Container,
  Group,
  Burger,
  Text,
  Drawer,
  Stack,
  Menu,
  Button,
  Avatar,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
//import { MantineLogo } from "@mantinex/mantine-logo";
import styles from "../styles/components/header.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Gear, SignOut } from "@phosphor-icons/react";
import { signout } from "../utils/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setAccessToken, setRefreshToken } from "../store/slices/authSlice";

const baseLinks = [
  { link: "/", label: "Home" },
  { link: "/history", label: "Booking History" },
];

const adminLink = { link: "/dashboard", label: "Admin Dashboard" };

const Header = () => {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(baseLinks[0].link);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useSelector((state: RootState) => state.auth.permission);
  const user = useSelector((state: RootState) => state.auth.username);
  const handleSignout = () => {
    signout().then((res) => {
      navigate("/login");
      dispatch(setAccessToken(undefined));
      dispatch(setRefreshToken(undefined));
    });
  };
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const links = isAdmin ? [...baseLinks, adminLink] : baseLinks;

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={styles.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        navigate(link.link);
        setOpened(false);
      }}
    >
      {link.label}
    </a>
  ));
  const path = location.pathname.split("/")[1];

  if (["login", "signup", "forgetPwd"].includes(path)) {
    return null;
  }
  return (
    <>
      <header className={styles.header}>
        <Container size="md" className={styles.inner}>
          {/* <MantineLogo size={28} /> */}
          <Text fw={700} style={{ fontSize: "20px" }}>
            Go Car
          </Text>
          <Group gap={15} visibleFrom="xs">
            {items}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Hi, {user}</Menu.Label>
                <Menu.Divider></Menu.Divider>
                <Menu.Item
                  onClick={() => handleSignout()}
                  style={{ color: "red" }}
                  leftSection={<SignOut size={16} />}
                >
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Burger
            opened={opened}
            onClick={() => setOpened(true)}
            hiddenFrom="xs"
            size="sm"
          />
        </Container>
      </header>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Text fw={700} style={{ fontSize: "20px" }}>
            Go Car
          </Text>
        }
      >
        <Stack>
          {items}
          <Divider w={"100%"} />

          <div
            className={styles.link}
            style={{ color: "red" }}
            onClick={() => handleSignout()}
          >
            Logout
          </div>
        </Stack>
      </Drawer>
    </>
  );
};

export default Header;
