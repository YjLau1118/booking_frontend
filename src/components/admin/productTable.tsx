import React, { useEffect, useState } from "react";
import { IProduct } from "../../pages/user/home";
import {
  Button,
  Card,
  Flex,
  Menu,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Browser, DotsThreeVertical, Pen, Trash } from "@phosphor-icons/react";
import ProductDetailsModal from "../modal/productDetailsModal";
import ProductDeleteModal from "../modal/productDeleteModal";
import { getAllProduct } from "../../utils/api/admin";
import ProductCreateModal from "../modal/productCreateModal";
import ProductEditModal from "../modal/productEditModal";
import { getProductDetailsById } from "../../utils/api/product";

interface IProductList {
  products: IProduct[];
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

const ProductTable = (props: IProductList) => {
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

  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [product, setProduct] = useState<IProduct | null>(null);

  const setId = (id: string) => {
    setSelectedProductId(id);
  };

  const handleOpenDetails = (productId: string) => {
    setSelectedProductId(productId);
    setOpenDetails(true);
  };

  const handleOpenDelete = (productId: string, productName: string) => {
    setSelectedProductName(productName);
    setSelectedProductId(productId);
    setOpenDelete(true);
  };

  const handleOpenEdit = (productId: string) => {
    setSelectedProductId(productId);
    setOpenEdit(true);
  };

  const handleProduct = () => {
    getAllProduct().then((res) => {
      props.setProducts(res.data);
    });
  };

  useEffect(() => {
    if (selectedProductId) {
      getProductDetailsById(selectedProductId).then((res) => {
        setProduct(res?.data);
      });
    }
  }, [selectedProductId]);

  const menu = (productId: string, productName: string) => {
    return (
      <>
        <Menu shadow="md" width={200}>
          {!isMobile ? (
            <Menu.Target>
              <Button variant="outline" color="#A9A9A9" size="sm">
                <DotsThreeVertical size={16} />
              </Button>
            </Menu.Target>
          ) : (
            <Menu.Target>
              <UnstyledButton color="#A9A9A9" size="10px">
                <DotsThreeVertical size={20} weight="bold" />
              </UnstyledButton>
            </Menu.Target>
          )}

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<Browser size={16} />}
              onClick={() => handleOpenDetails(productId)}
            >
              Details
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={() => handleOpenEdit(productId)}
              leftSection={<Pen size={16} />}
            >
              Edit
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={() => handleOpenDelete(productId, productName)}
              style={{ color: "red" }}
              leftSection={<Trash size={16} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </>
    );
  };

  const rows = props.products.map((product, index) => (
    <Table.Tr key={product._id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{product._id}</Table.Td>
      <Table.Td>{product.productName}</Table.Td>
      <Table.Td>{product.productBrand}</Table.Td>
      <Table.Td>{product.productModel}</Table.Td>
      <Table.Td>{menu(product._id, product.productName)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      {!isMobile ? (
        <>
          <Button w={"30%"} m={"20px 0"} onClick={() => setOpenCreate(true)}>
            Create
          </Button>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No</Table.Th>
                <Table.Th>Id</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Brand</Table.Th>
                <Table.Th>Model</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </>
      ) : (
        <>
          <Button w={"100%"} m={"20px 0"} onClick={() => setOpenCreate(true)}>
            Create
          </Button>
          {props.products.map((product, index) => (
            <Card
              shadow="sm"
              padding="sm"
              radius="md"
              withBorder
              mb={20}
              key={product._id}
            >
              <Flex justify={"flex-end"}>
                {menu(product._id, product.productName)}
              </Flex>
              <Stack gap={10}>
                <div>
                  <Text fw={700}>Id</Text>
                  <Text fw={400}>{product._id}</Text>
                </div>
                <div>
                  <Text fw={700}>Name</Text>
                  <Text fw={400}>{product.productName}</Text>
                </div>
                <div>
                  <Text fw={700}>Brand</Text>
                  <Text fw={400}>{product.productBrand}</Text>
                </div>
                <div>
                  <Text fw={700}>Model</Text>
                  <Text fw={400}>{product.productModel}</Text>
                </div>
              </Stack>
            </Card>
          ))}
        </>
      )}

      <ProductDetailsModal
        opened={openDetails}
        onClose={() => setOpenDetails(false)}
        id={selectedProductId}
        onProductDetail={handleProduct}
      />
      <ProductDeleteModal
        opened={openDelete}
        onClose={() => setOpenDelete(false)}
        id={selectedProductId}
        name={selectedProductName}
        onProductDelete={handleProduct}
      />
      <ProductCreateModal
        opened={openCreate}
        onClose={() => setOpenCreate(false)}
        onProductCreate={handleProduct}
      />
      <ProductEditModal
        opened={openEdit}
        onClose={() => setOpenEdit(false)}
        product={product!}
        id={selectedProductId}
        onProductUpdate={handleProduct}
        setId={setId}
      />
    </div>
  );
};

export default ProductTable;
