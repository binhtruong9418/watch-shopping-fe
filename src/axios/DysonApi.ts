import AxiosClient from "./AxiosClient.ts";
import axios from "axios";

const DysonApi = {

    //Product
    getAllProduct: async (params = {}): Promise<any> => {
        const url = "product"
        const response = await AxiosClient.get(url, {params});
        return response.data
    },

    addProduct: async (data: any): Promise<any> => {
        const url = "product"
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    getProductById: async (id: string): Promise<any> => {
        const url = `product/${id}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateProductById: async (id: string, data: any) => {
        const url = `product/${id}`
        const response = await AxiosClient.put(url, data);
        return response.data
    },

    deleteProductById: async (id: string) => {
        const url = `product/${id}`
        const response = await AxiosClient.delete(url);
        return response.data
    },

    //Category

    getAllCategory: async (): Promise<any> => {
        const url = "categories"
        const response = await AxiosClient.get(url);
        return response.data
    },

    getCategoryByName: async (name: string): Promise<any> => {
        const url = `categories/find-by-name/${name}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateCategoryById: async (id: string, data: any): Promise<any> => {
        const url = `categories/update/${id}`
        const response = await AxiosClient.put(url, data);
        return response.data
    },

    addCategory: async (data: any): Promise<any> => {
        const url = `categories`
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    deleteCategoryById: async (id: string): Promise<any> => {
        const url = `categories/delete/${id}`
        const response = await AxiosClient.delete(url);
        return response.data
    },

    //Cart

    createCart: async (): Promise<any> => {
        const url = "cart"
        const response = await AxiosClient.post(url);
        return response.data._id
    },

    getCart: async (cartId: string): Promise<any> => {
        const url = "cart/" + cartId
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateCart: async (cartId: string, data: any): Promise<any> => {
        const url = "cart/update/" + cartId
        const response = await AxiosClient.put(url, data);
        return response.data
    },

    clearCart: async (cartId: string): Promise<any> => {
        const url = "cart/clear/" + cartId
        const response = await AxiosClient.put(url);
        return response.data
    },

    //order

    createOrder: async (data: any): Promise<any> => {
        const url = "order"
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    getAllOrder: async (params = {}): Promise<any> => {
        const url = "order/"
        const response = await AxiosClient.get(url, {params});
        return response.data
    },

    getOrderById: async (id: string, identifier: string): Promise<any> => {
        const url = `order/${id}/${identifier}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateOrderStatus: async (id: string, data: any): Promise<any> => {
        const url = `order/update-status/${id}`
        const response = await AxiosClient.put(url, {
            status: data
        });
        return response.data
    },

    cancelOrder: async (id: string, identifier: string): Promise<any> => {
        const url = `order/cancel-order/${id}/${identifier}`
        const response = await AxiosClient.post(url);
        return response.data
    },

    refundOrder: async (id: string): Promise<any> => {
        const url = 'order/refund-order/' + id
        const response = await AxiosClient.post(url);
        return response.data
    },

    //admin
    getEmailCode: async (email: string): Promise<any> => {
        const url = 'user/get-email-code?email=' + email
        const response = await AxiosClient.get(url);
        return response.data
    },

    login: async (email: string, password: string): Promise<any> => {
        const url = 'user/login'
        const response = await AxiosClient.post(url, {email, password});
        return response.data
    },

    register: async (data: any): Promise<any> => {
        const url = 'user/register'
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    //file
    uploadFile: async (file: any): Promise<any> => {
        const url = 'file/get-signed-url'

        const fileName = file.name.trim().replace(/\s/g, "-");
        const response = await AxiosClient.post(url, {fileName});

        const signedUrl = response.data.presignedUrl;
        await axios.put(signedUrl, file, {
            headers: {
                'Content-Type': file.type,
            }
        });

        return response.data.url
    },

    createVnpayPaymentUrl: async (orderId: string): Promise<any> => {
        const url = 'payment/create-vnpay-payment-url/' + orderId
        const response = await AxiosClient.get(url);
        return response.data
    },

    createComment: async (data: any): Promise<any> => {
        const url = 'comment'
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    getAllCommentByProductId: async (productId: string): Promise<any> => {
        const url = 'comment/get-all-by-product/' + productId
        const response = await AxiosClient.get(url);
        return response.data
    },

    checkCanComment: async (cartId: string, productId: string): Promise<any> => {
        const url = `comment/can-comment/${cartId}/${productId}`
        const response = await AxiosClient.get(url);
        return response.data
    }
};

export default DysonApi;

