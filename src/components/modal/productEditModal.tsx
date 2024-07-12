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
import { getImageById, uploadImage } from "../../utils/api/bucket";
import { CurrencyDollar, XCircle } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import {
  createProduct,
  getProductDetailsById,
  updateProduct,
} from "../../utils/api/product";
import { IProduct } from "../../pages/user/home";
import { base64ToFile } from "../../utils/common";

interface IProps {
  opened: boolean;
  onClose: () => void;
  product: IProduct;
  id: string;
  onProductUpdate: () => void;
  setId: (id: string) => void;
}

const ProductEditModal = (props: IProps) => {
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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);

  useEffect(() => {
    const files = images.map((base64Data, index) => {
      const filename = `image_${index}.jpg`;
      const mimeType = "image/jpeg";

      return base64ToFile(base64Data, filename, mimeType);
    });
    setConvertedFiles(files);
  }, [images]);

  const updateForm = useForm({
    initialValues: {
      productName: props.product?.productName,
      productBrand: props.product?.productBrand,
      productModel: props.product?.productModel,
      productPlate: props.product?.productPlate,
      productVariant: props.product?.productVariant,
      productSeries: props.product?.productSeries,
      productType: props.product?.productType,
      productSeat: props.product?.productSeat,
      productManufacturingYear: props.product?.productManufacturingYear,
      productMode: props.product?.productMode,
      productFuelType: props.product?.productFuelType,
      productPricePerDay: props.product?.productPricePerDay,
    },
  });

  useEffect(() => {
    updateForm.setValues({
      productName: props.product?.productName || "-",
      productBrand: props.product?.productBrand || "",
      productModel: props.product?.productModel || "",
      productPlate: props.product?.productPlate || "",
      productVariant: props.product?.productVariant || "",
      productSeries: props.product?.productSeries || "",
      productType: props.product?.productType || "",
      productSeat: props.product?.productSeat || undefined,
      productManufacturingYear:
        props.product?.productManufacturingYear || undefined,
      productMode: props.product?.productMode || "",
      productFuelType: props.product?.productFuelType || "",
      productPricePerDay: props.product?.productPricePerDay || undefined,
    });
  }, [props.product]);

  useEffect(() => {
    const fetchImages = async () => {
      if (props.product && props.product.productImage) {
        const imagePromises = props.product.productImage.map((imageId) =>
          getImageById(imageId)
        );
        const imageResults = await Promise.all(imagePromises);
        const imageData = imageResults.map((result) => result.data);
        setImages(imageData);
      }
    };

    fetchImages();
  }, [props.product]);

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

  console.log(convertedFiles);

  const handleDisable = () => {
    const values = updateForm.values;
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
      imageFiles.length + convertedFiles.length > 0
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

  const handleRemoveConvertedImage = (index: number) => {
    setConvertedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    const ids = [];
    // Upload newly added images
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
    // Combine with existing converted files
    for (const file of convertedFiles) {
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

    console.log(ids);
    return ids;
  };

  const handleUpdateProduct = async () => {
    try {
      setSubmitting(true);
      const ids = await handleUploadImages();
      const res = await updateProduct(
        props.id,
        updateForm.values.productName,
        updateForm.values.productBrand,
        updateForm.values.productModel,
        updateForm.values.productPlate,
        ids,
        updateForm.values.productVariant,
        updateForm.values.productSeries,
        updateForm.values.productType,
        updateForm.values.productSeat!,
        updateForm.values.productManufacturingYear!,
        updateForm.values.productMode,
        updateForm.values.productFuelType,
        updateForm.values.productPricePerDay!
      );
      console.log(res);
      setOpenSuccess(true);
      props.onProductUpdate();
      props.onClose();
      props.setId("");
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
        title="Update Product"
        size={700}
        centered
        fullScreen={isMobile}
      >
        <form onSubmit={updateForm.onSubmit(() => handleUpdateProduct())}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              margin: "20px 0",
            }}
          >
            {/* Display converted image files */}
            {convertedFiles.map((file, index) => (
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
                  onClick={() => handleRemoveConvertedImage(index)}
                />
              </div>
            ))}
            {/* Display uploaded image files */}
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

            {convertedFiles.length + imageFiles.length < 9 && (
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
              {...updateForm.getInputProps("productName")}
            />
            <TextInput
              label={<Text fw={700}>Brand</Text>}
              placeholder="Brand"
              {...updateForm.getInputProps("productBrand")}
            />
            <TextInput
              label={<Text fw={700}>Model</Text>}
              placeholder="Model"
              {...updateForm.getInputProps("productModel")}
            />
            <TextInput
              label={<Text fw={700}>Plate</Text>}
              placeholder="Plate"
              {...updateForm.getInputProps("productPlate")}
            />
            <TextInput
              label={<Text fw={700}>Variant</Text>}
              placeholder="Variant"
              {...updateForm.getInputProps("productVariant")}
            />
            <TextInput
              label={<Text fw={700}>Series</Text>}
              placeholder="Series"
              {...updateForm.getInputProps("productSeries")}
            />
            <TextInput
              label={<Text fw={700}>Type</Text>}
              placeholder="Type"
              {...updateForm.getInputProps("productType")}
            />
            <NumberInput
              label={<Text fw={700}>Seat</Text>}
              placeholder="Seat"
              min={2}
              max={20}
              {...updateForm.getInputProps("productSeat")}
            />
            <NumberInput
              label={<Text fw={700}>Manufacturing Year</Text>}
              hideControls
              placeholder="Manufacturing Year"
              {...updateForm.getInputProps("productManufacturingYear")}
            />
            <Select
              label={<Text fw={700}>Mode</Text>}
              placeholder="Mode"
              data={carMode}
              {...updateForm.getInputProps("productMode")}
            />
            <Select
              label={<Text fw={700}>Fuel Type</Text>}
              placeholder="Fuel Type"
              data={fuelType}
              {...updateForm.getInputProps("productFuelType")}
            />
            <NumberInput
              label={<Text fw={700}>Price Per Day</Text>}
              hideControls
              placeholder="Price Per Day"
              leftSection={<CurrencyDollar size={18} />}
              {...updateForm.getInputProps("productPricePerDay")}
            />
          </Stack>

          <Button
            type="submit"
            disabled={handleDisable() || submitting}
            w={"100%"}
            style={{ marginTop: "20px" }}
          >
            Update Product
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
          Update Successfully
        </Text>
        <Group align="flex-end">
          <Text size="sm" fw={500}>
            Product has been updated
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

export default ProductEditModal;
