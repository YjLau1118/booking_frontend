import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/admin/admin.module.scss";
import { Card, Flex, Tabs, Text } from "@mantine/core";
import {
  getAllBooking,
  getAllProduct,
  getAllUser,
  getStatisticData,
} from "../../utils/api/admin";
import { ShoppingBag, ShoppingCart, User } from "@phosphor-icons/react";
import UserTable from "../../components/admin/userTable";
import BookingTable from "../../components/admin/bookingTable";
import ProductTable from "../../components/admin/productTable";
import { IHistory } from "../user/history";
import { IProduct } from "../user/home";

interface IStatistic {
  totalBookings: number;
  totalUsers: number;
  totalProducts: number;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminDashboard = () => {
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

  const [statistic, setStatistic] = useState<IStatistic>();
  const [userList, setUserList] = useState<IUser[]>([]);
  const [bookingList, setBookingList] = useState<IHistory[]>([]);
  const [productList, setProductList] = useState<IProduct[]>([]);
  useEffect(() => {
    getStatisticData().then((res) => {
      setStatistic(res.data);
    });

    getAllUser().then((res) => {
      setUserList(res.data);
    });

    getAllBooking().then((res) => {
      setBookingList(res.data);
    });

    getAllProduct().then((res) => {
      setProductList(res.data);
    });
  }, []);
  return (
    <div className={styles.pageContainer}>
      {!isMobile ? (
        <div style={{ width: "836px" }}>
          <Flex align={"center"} justify={"space-between"}>
            <Card
              shadow="sm"
              padding="20px"
              radius="md"
              withBorder
              mb={20}
              w={"250px"}
            >
              <Text fw={700}>Total User Registered</Text>
              <Text fw={700} size="40px" c="#A9A9A9">
                {statistic?.totalUsers}
              </Text>
            </Card>
            <Card
              shadow="sm"
              padding="20px"
              radius="md"
              withBorder
              mb={20}
              w={"250px"}
            >
              <Text fw={700}>Total Booking</Text>
              <Text fw={700} size="40px" c="#A9A9A9">
                {statistic?.totalBookings}
              </Text>
            </Card>
            <Card
              shadow="sm"
              padding="20px"
              radius="md"
              withBorder
              mb={20}
              w={"250px"}
            >
              <Text fw={700}>Total Product</Text>
              <Text fw={700} size="40px" c="#A9A9A9">
                {statistic?.totalProducts}
              </Text>
            </Card>
          </Flex>
          <Tabs defaultValue="user" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="user" leftSection={<User />}>
                User
              </Tabs.Tab>
              <Tabs.Tab value="booking" leftSection={<ShoppingCart />}>
                Booking
              </Tabs.Tab>
              <Tabs.Tab value="product" leftSection={<ShoppingBag />}>
                Product
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="user" m={"10px 0 2rem 0"}>
              <UserTable users={userList} />
            </Tabs.Panel>

            <Tabs.Panel value="booking" m={"10px 0 2rem 0"}>
              <BookingTable bookings={bookingList} />
            </Tabs.Panel>

            <Tabs.Panel value="product" m={"10px 0 2rem 0"}>
              <ProductTable
                products={productList}
                setProducts={setProductList}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      ) : (
        <>
          <Card
            shadow="sm"
            padding="20px"
            radius="md"
            w={"100%"}
            withBorder
            mb={20}
          >
            <Text fw={700}>Total User Registered</Text>
            <Text fw={700} size="40px" c="#A9A9A9">
              {statistic?.totalUsers}
            </Text>
          </Card>
          <Card
            shadow="sm"
            padding="20px"
            radius="md"
            w={"100%"}
            withBorder
            mb={20}
          >
            <Text fw={700}>Total Booking</Text>
            <Text fw={700} size="40px" c="#A9A9A9">
              {statistic?.totalBookings}
            </Text>
          </Card>
          <Card
            shadow="sm"
            padding="20px"
            radius="md"
            w={"100%"}
            withBorder
            mb={20}
          >
            <Text fw={700}>Total Product</Text>
            <Text fw={700} size="40px" c="#A9A9A9">
              {statistic?.totalProducts}
            </Text>
          </Card>
          <Tabs w={"100%"} defaultValue="user" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="user" leftSection={<User />}>
                User
              </Tabs.Tab>
              <Tabs.Tab value="booking" leftSection={<ShoppingCart />}>
                Booking
              </Tabs.Tab>
              <Tabs.Tab value="product" leftSection={<ShoppingBag />}>
                Product
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="user" m={"10px 0 2rem 0"}>
              <UserTable users={userList} />
            </Tabs.Panel>

            <Tabs.Panel value="booking" m={"10px 0 2rem 0"}>
              <BookingTable bookings={bookingList} />
            </Tabs.Panel>

            <Tabs.Panel value="product" m={"10px 0 2rem 0"}>
              <ProductTable
                products={productList}
                setProducts={setProductList}
              />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
