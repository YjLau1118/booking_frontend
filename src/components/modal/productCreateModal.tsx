import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DropzoneOptions } from "react-dropzone";
import Dropzone from "react-dropzone";
import { uploadImage } from "../../utils/api/bucket";
import { CurrencyDollar, XCircle } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import { createProduct } from "../../utils/api/product";

interface IProps {
  opened: boolean;
  onClose: () => void;
  onProductCreate: () => void;
}

const ProductCreateModal = (props: IProps) => {
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

  const [openImageError, setOpenImageError] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false); // Track form submission
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const createForm = useForm({
    initialValues: {
      productName: "",
      productBrand: "",
      productModel: "",
      productPlate: "",
      productVariant: "",
      productSeries: "",
      productType: "",
      productSeat: undefined,
      productManufacturingYear: undefined,
      productMode: "",
      productFuelType: "",
      productPricePerDay: undefined,
    },
  });

  const fuelType = [
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Electric", label: "Electric" },
  ];

  const carMode = [
    { value: "Manual", label: "Manual" },
    { value: "Auto", label: "Auto" },
  ];
  const handleDisable = () => {
    const values = createForm.values;
    return !(
      values.productName &&
      values.productBrand &&
      values.productModel &&
      values.productPlate &&
      values.productVariant &&
      values.productSeries &&
      values.productType &&
      values.productSeat &&
      values.productManufacturingYear &&
      values.productMode &&
      values.productFuelType &&
      values.productPricePerDay &&
      imageFiles.length > 0
    );
  };

  const handleDrop: DropzoneOptions["onDrop"] = (acceptedFiles) => {
    if (imageFiles.length + acceptedFiles.length <= 9) {
      setImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    } else {
      setOpenImageError(true);
      setImageError("You can only upload up to 9 images.");
      setTimeout(() => {
        setOpenImageError(false);
        setImageError("");
      }, 3000);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    const ids = [];
    for (const file of imageFiles) {
      try {
        const res = await uploadImage(file);
        ids.push(res.data._id);
      } catch (err: any) {
        setOpenImageError(true);
        setImageError(err.message || "Failed to upload image.");
        setTimeout(() => {
          setOpenImageError(false);
          setImageError("");
        }, 3000);
        throw err;
      }
    }
    return ids;
  };

  const handleCreateProduct = async () => {
    try {
      setSubmitting(true);
      const ids = await handleUploadImages();
      const res = await createProduct(
        createForm.values.productName,
        createForm.values.productBrand,
        createForm.values.productModel,
        createForm.values.productPlate,
        ids,
        createForm.values.productVariant,
        createForm.values.productSeries,
        createForm.values.productType,
        createForm.values.productSeat!,
        createForm.values.productManufacturingYear!,
        createForm.values.productMode,
        createForm.values.productFuelType,
        createForm.values.productPricePerDay!
      );
      console.log(res);
      setOpenSuccess(true);
      props.onClose();
      props.onProductCreate();
      setImageIds([]);
      setTimeout(() => {
        setOpenSuccess(false);
      }, 3000);
    } catch (error: any) {
      setOpenError(true);
      setError(error.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        opened={props.opened}
        onClose={props.onClose}
        radius={"sm"}
        padding={"20px"}
        title="Create Product"
        size={700}
        fullScreen={isMobile}
        centered
      >
        <form onSubmit={createForm.onSubmit(handleCreateProduct)}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              margin: "20px 0",
            }}
          >
            {imageFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <XCircle
                  size={"25px"}
                  color="#A9A9A9"
                  weight="fill"
                  style={{
                    position: "absolute",
                    right: "-5px",
                    top: "-5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
            {imageFiles.length < 9 && (
              <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      border: "2px dashed #aaa",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px",
                      height: "100px",
                      position: "relative",
                    }}
                  >
                    <input {...getInputProps()} />
                    <p>+</p>
                  </div>
                )}
              </Dropzone>
            )}
          </div>
          <Stack gap={10}>
            <TextInput
              label={<Text fw={700}>Full Name</Text>}
              placeholder="Full Name"
              {...createForm.getInputProps("productName")}
            />
            <TextInput
              label={<Text fw={700}>Brand</Text>}
              placeholder="Brand"
              {...createForm.getInputProps("productBrand")}
            />
            <TextInput
              label={<Text fw={700}>Model</Text>}
              placeholder="Model"
              {...createForm.getInputProps("productModel")}
            />
            <TextInput
              label={<Text fw={700}>Plate</Text>}
              placeholder="Plate"
              {...createForm.getInputProps("productPlate")}
            />
            <TextInput
              label={<Text fw={700}>Variant</Text>}
              placeholder="Variant"
              {...createForm.getInputProps("productVariant")}
            />
            <TextInput
              label={<Text fw={700}>Series</Text>}
              placeholder="Series"
              {...createForm.getInputProps("productSeries")}
            />
            <TextInput
              label={<Text fw={700}>Type</Text>}
              placeholder="Type"
              {...createForm.getInputProps("productType")}
            />
            <NumberInput
              label={<Text fw={700}>Seat</Text>}
              placeholder="Seat"
              min={2}
              max={20}
              {...createForm.getInputProps("productSeat")}
            />
            <NumberInput
              label={<Text fw={700}>Manufacturing Year</Text>}
              hideControls
              placeholder="Manufacturing Year"
              {...createForm.getInputProps("productManufacturingYear")}
            />
            <Select
              label={<Text fw={700}>Mode</Text>}
              placeholder="Mode"
              data={carMode}
              {...createForm.getInputProps("productMode")}
            />
            <Select
              label={<Text fw={700}>Fuel Type</Text>}
              placeholder="Fuel Type"
              data={fuelType}
              {...createForm.getInputProps("productFuelType")}
            />
            <NumberInput
              label={<Text fw={700}>Price Per Day</Text>}
              hideControls
              placeholder="Price Per Day"
              leftSection={<CurrencyDollar size={18} />}
              {...createForm.getInputProps("productPricePerDay")}
            />
          </Stack>

          <Button
            type="submit"
            disabled={handleDisable() || submitting}
            w={"100%"}
            style={{ marginTop: "20px" }}
          >
            Create Product
          </Button>
        </form>
      </Modal>
      <Dialog
        opened={openImageError}
        withCloseButton
        onClose={() => setOpenImageError(false)}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={700} c={"red"}>
          {imageError}
        </Text>
        <Group align="flex-end">
          <Text size="sm" fw={500}>
            Please upload again
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
          Created Successfully
        </Text>
        <Group align="flex-end">
          <Text size="sm" fw={500}>
            New Product has been created
          </Text>
        </Group>
      </Dialog>
      <Dialog
        opened={openError}
        withCloseButton
        onClose={() => setOpenError(false)}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={700} c={"green"}>
          {error}
        </Text>
        <Group align="flex-end">
          <Text size="sm" fw={500}>
            Please try again later
          </Text>
        </Group>
      </Dialog>
    </>
  );
};

export default ProductCreateModal;
