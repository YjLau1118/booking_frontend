import React, { useEffect, useState } from "react";
import { deleteProduct } from "../../utils/api/product";
import { Button, Dialog, Group, Modal, Text } from "@mantine/core";

interface IProps {
  opened: boolean;
  onClose: () => void;
  id: string;
  name: string;
  onProductDelete: () => void;
}

const ProductDeleteModal = (props: IProps) => {
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
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  const handleDelete = () => {
    deleteProduct(props.id)
      .then((res) => {
        props.onClose();
        setOpenSuccess(true);
        props.onProductDelete();
        setTimeout(() => {
          setOpenSuccess(false);
        }, 3000);
      })
      .catch((err) => {
        setOpenError(true);
        setError(err.message);
        setTimeout(() => {
          setOpenError(false);
          setError("");
        }, 5000);
      });
  };

  return (
    <>
      <Modal
        opened={props.opened}
        onClose={props.onClose}
        radius={"sm"}
        padding={"20px"}
        title="Delete Product"
        size={500}
        fullScreen={isMobile}
        centered
      >
        <div>
          <Text>
            Are you sure you want to permanently delete{" "}
            <strong>{props.name}</strong>?
          </Text>
        </div>
        <Button
          w={"100%"}
          color={"red"}
          m={"20px 0"}
          onClick={() => handleDelete()}
        >
          Delete
        </Button>
      </Modal>
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
            Please try again
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
          Product deleted successfully
        </Text>
        <Group align="flex-end">
          <Text size="sm" fw={500}>
            The product <strong>{props.name}</strong> is permanently deleted.
          </Text>
        </Group>
      </Dialog>
    </>
  );
};

export default ProductDeleteModal;
