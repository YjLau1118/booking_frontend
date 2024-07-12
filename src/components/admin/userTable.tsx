import { Card, Stack, Table, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { formatDateWithTime } from "../../utils/common";
import { IUser } from "../../pages/admin/dashboard";

interface IUserList {
  users: IUser[];
}
const UserTable = (props: IUserList) => {
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

  const rows = props.users.map((user, index) => (
    <Table.Tr key={user._id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{user._id}</Table.Td>
      <Table.Td>{user.username}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.isAdmin ? "Admin" : "User"}</Table.Td>
      <Table.Td>{formatDateWithTime(user.createdAt)}</Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      {!isMobile ? (
        <Table.ScrollContainer minWidth={835}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No</Table.Th>
                <Table.Th>User Id</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>User Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Created At</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : (
        <>
          {props.users.map((user, index) => (
            <Card
              shadow="sm"
              padding="sm"
              radius="md"
              withBorder
              mb={20}
              key={user._id}
            >
              <Stack gap={10}>
                <div>
                  <Text fw={700}>User Id</Text>
                  <Text fw={400}>{user._id}</Text>
                </div>
                <div>
                  <Text fw={700}>Username</Text>
                  <Text fw={400}>{user.username}</Text>
                </div>
                <div>
                  <Text fw={700}>User Email</Text>
                  <Text fw={400}>{user.email}</Text>
                </div>
                <div>
                  <Text fw={700}>Role</Text>
                  <Text fw={400}>{user.isAdmin ? "Admin" : "User"}</Text>
                </div>
                <div>
                  <Text fw={700}>Created At</Text>
                  <Text fw={400}>{formatDateWithTime(user.createdAt)}</Text>
                </div>
              </Stack>
            </Card>
          ))}
        </>
      )}
    </>
  );
};

export default UserTable;
