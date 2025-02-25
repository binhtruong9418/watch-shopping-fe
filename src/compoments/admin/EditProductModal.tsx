import {
    Button,
    Carousel,
    Col,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Typography,
    Upload
} from 'antd';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify'

import { CloudUploadOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import DysonApi from '../../axios/DysonApi.ts';
import { useQuery } from 'react-query';
import {LIST_PRODUCT_SIZE} from "../../constants";
import AddColor from "./AddColor.tsx";
const IMAGE_TYPES = ["image/png", "image/jpeg"];


const EditProductModal = ({ isVisible,
    setIsVisible,
    id,
    images,
    name,
    description,
    price,
    category,
    quantity,
    currentPrice,
    sizes,
    colors,
    refetchProduct,
}: any) => {
    const [form] = Form.useForm();
    const [imagesFile, setImagesFile] = useState<any[]>(images)
    const [listImage, setListImage] = useState<any[]>(images)
    const carouselRef = useRef(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [productColor, setProductColor] = useState<string[]>(colors);

    const {
        data: listCategory = [],
    } = useQuery('getListCategory', () => DysonApi.getAllCategory(), {
        refetchOnWindowFocus: 'always',
    }
    );

    const handleSubmit = async () => {
        //check error when user submit
        const data = form.getFieldsValue()
        const {
            productName,
            productDescription,
            productCategory,
            productPrice,
            productQuantity,
            productCurrentPrice,
            productSize
        } = data

        try {
            setIsLoading(true);
            let listNewImages: any[] = []
            if (listImage.length > 0) {
                const res = await Promise.all(
                    listImage.map((item: any) => {
                        if (typeof item === "string") {
                            return item;
                        } else {
                            return DysonApi.uploadFile(item);
                        }
                    })
                );
                listNewImages = res
            }
            const updateProduct = await DysonApi.updateProductById(id, {
                name: productName,
                description: productDescription,
                category: productCategory,
                price: productPrice,
                quantity: productQuantity,
                images: listNewImages,
                currentPrice: productCurrentPrice,
                sizes: productSize,
                colors: productColor,
            })
            form.setFieldsValue({
                productName: updateProduct.name,
                productDescription: updateProduct.description,
                productCategory: updateProduct.category,
                productPrice: updateProduct.price,
                productQuantity: updateProduct.quantity,
                productCurrentPrice: updateProduct.currentPrice,
                productSize: updateProduct.sizes,
            })

            setImagesFile(updateProduct.images)
            setListImage(updateProduct.images)
            await refetchProduct()
            toast.success("Cập nhật sản phẩm thành công");
            setIsVisible(false);
        } catch (error) {
            toast.error("Cập nhật sản phẩm thất bại");
        } finally {
            setIsLoading(false);
        }
    }

    const handleChooseThumbnail = async ({ file }: any) => {
        if (IMAGE_TYPES.includes(file.type)) {
            setListImage([...listImage, file]);

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImagesFile(prev => [...prev, reader.result]);
            });
            reader.readAsDataURL(file);

        } else {
            toast.error("Chỉ chấp nhận file ảnh");
        }
    };

    const handleDeleteImage = (index: number) => {
        setListImage(listImage.filter((_: any, i: number) => i !== index));
        setImagesFile(imagesFile.filter((_: any, i: number) => i !== index));
    }

    const onResetForm = () => {
        form.resetFields();
        setListImage([]);
        setImagesFile([]);
    }

    return (
        <Modal
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            footer={null}
        >
            <div>
                <Typography.Title level={4}>
                    Cập nhật sản phẩm
                </Typography.Title>

                <Space
                    direction="vertical"
                    style={{
                        width: "100%",
                    }}
                    size="large">
                    <Upload.Dragger
                        accept={IMAGE_TYPES.join(
                            ", "
                        )}
                        customRequest={
                            handleChooseThumbnail
                        }
                        maxCount={10}
                        multiple
                        showUploadList={false}
                    >
                        <Button className="d-flex m-auto align-items-center">
                            <CloudUploadOutlined className='mr-2' />
                            <div>Tải ảnh (Tối đa: 10)</div>
                        </Button>
                    </Upload.Dragger>
                    {imagesFile && imagesFile.length > 0 &&
                        <Carousel ref={carouselRef} dotPosition="top">
                            {
                                imagesFile.map((x, index: number) => (
                                    <div key={index}>
                                        <div className='d-flex align-items-center justify-content-center position'>
                                            {/* @ts-ignore */}
                                            <LeftOutlined className="cursor-pointer" onClick={() => carouselRef?.current?.prev()} />
                                            <div className="m-auto" style={{
                                                width: "50%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <Image
                                                    src={x}
                                                    preview={false}
                                                />
                                            </div>
                                            {/* @ts-ignore */}
                                            <RightOutlined className="cursor-pointer" onClick={() => carouselRef?.current?.next()} />
                                        </div>
                                        <div className='d-flex justify-content-center mt-3'>
                                            <DeleteOutlined className="cursor-pointer" width={50} height={50} onClick={() => handleDeleteImage(index)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </Carousel>
                    }
                </Space>

                <Form
                    style={{
                        boxShadow: '0px 4px 30px 0px rgba(27, 25, 86, 0.10)',
                        borderRadius: '12px',
                        marginTop: '24px',
                        padding: '20px 24px',
                        gap: '20px'
                    }}
                    name="editProduct"
                    initialValues={{
                        productName: name,
                        productDescription: description,
                        productCategory: category,
                        productPrice: price,
                        productQuantity: quantity,
                        productCurrentPrice: currentPrice,
                        productSize: sizes,
                    }}
                    onFinish={handleSubmit}
                    form={form}
                >
                    <Form.Item
                        name='productName'
                        rules={[{
                            required: true,
                            message: 'Vui lòng nhập tên sản phẩm!',
                        }]}
                    >
                        <Input
                            placeholder="Tên sản phẩm"
                            bordered={false}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="productDescription"
                    >
                        <Input.TextArea
                            placeholder="Description"
                            className="border round-sm"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        name="productCategory"
                        rules={[{
                            required: true,
                            message: 'Vui lòng chọn danh mục!'
                        }]}
                    >
                        <Select
                            placeholder="Danh mục"
                            allowClear
                            size="large"
                        >
                            {listCategory.map(({ name }: any) => (
                                <Select.Option
                                    value={name}
                                    key={name}>
                                    {name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name={"productSize"}
                        required={true}
                    >
                        <Select
                            placeholder={"Size"}
                            mode="multiple"
                            size="large"
                            allowClear={true}
                        >
                            {
                                LIST_PRODUCT_SIZE.map((size) => (
                                    <Select.Option value={size.value} key={size.value}>{size.label}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="productColor"
                            >
                                <AddColor
                                    tags={productColor}
                                    setTags={setProductColor}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="productPrice"
                        rules={[{
                            required: true,
                            message: 'Vui lòng nhập giá gốc sản phẩm'
                        }]}
                    >
                        <InputNumber
                            placeholder="Giá"
                            addonAfter='₫'
                            className="w-100"
                            size="large"
                            min={0}
                        />
                    </Form.Item>
                    <Form.Item
                        name="productCurrentPrice"
                    >
                        <InputNumber
                            placeholder="Giá khuyến mãi"
                            addonAfter='₫'
                            className="w-100"
                            size="large"
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item
                        name="productQuantity"
                        rules={[{
                            required: true,
                            message: 'Vui lòng nhập số lượng sản phẩm!'
                        }]}
                    >
                        <InputNumber
                            placeholder="Số lượng"
                            className="w-100"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-50" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Cập nhật sản phẩm'}
                        </Button>
                        <Button htmlType="button" onClick={onResetForm} className="w-50">
                            {isLoading ? 'Loading...' : 'Reset'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal >
    )
}

export default EditProductModal