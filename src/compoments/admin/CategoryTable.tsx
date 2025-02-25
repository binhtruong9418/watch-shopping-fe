import {Button, Form, Input, Popconfirm, Space, Table, Typography} from "antd";
import { useQuery } from "react-query";
import DysonApi from "../../axios/DysonApi.ts";
import { useState } from "react";
import { toast } from "react-toastify";
import AddCategoryModal from "./AddCategoryModal";
import {BiPencil, BiTrash} from "react-icons/bi";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}: any) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng điền ${title}!`,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function CategoryTable() {

    const [form] = Form.useForm();
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const {
        data: listCategory = [],
        isLoading,
        refetch,
    } = useQuery('getListCategory', () => DysonApi.getAllCategory(), {
        refetchOnWindowFocus: false,
    }
    );

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: any) => record.key === editingKey;
    const edit = (record: any) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key: string) => {
        try {
            const row = await form.validateFields();
            const categoryUpdate = await DysonApi.updateCategoryById(key, {
                name: row.name,
                description: row.description
            })
            if (categoryUpdate) {
                toast.success('Cập nhật danh mục thành công')
                await refetch()
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            const resp = await DysonApi.deleteCategoryById(id)
            if (resp) {
                toast.success('Xóa danh mục thành công')
                await refetch()
            }
        } catch (error) {
            toast.error('Xóa danh mục thâất bại')
        }
    }
    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            editable: true,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            OK
                        </Typography.Link>
                        <Popconfirm title="Chắc chắn muốn hủy?" onConfirm={cancel}>
                            <a>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Space>
                        <Button
                            type="text"
                            disabled={editingKey !== ''} onClick={() => edit(record)}
                        >
                            <BiPencil />
                        </Button>
                        <Popconfirm title="Chắc chắn muốn xóa ?" onConfirm={() => handleDeleteCategory(record.key).then()}>
                            <Button type="text" danger>
                                <BiTrash/>
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            },
        }
    ]

    const listCategoryTable = listCategory.map((category: any) => {
        return {
            key: category._id,
            name: category.name,
            description: category.description,
        }
    })

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Button type='primary' className="my-3 ml-3" onClick={() => setIsAdd(true)}>
                Thêm danh mục
            </Button>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={listCategoryTable}
                    pagination={false}
                    bordered
                    loading={isLoading}
                    scroll={{ x: '50vw' }}
                />
            </Form>
            <AddCategoryModal
                isVisible={isAdd}
                setIsVisible={setIsAdd}
                refetchCategory={refetch}
            />
        </>
    )
}