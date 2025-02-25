import {useQuery, useQueryClient} from "react-query";
import ProductCardInfo from "../compoments/ProductCardInfo.tsx";
import {useCookies} from "react-cookie";
import DysonApi from "../axios/DysonApi.ts";
import {Skeleton} from "antd";
import {toast} from "react-toastify";
import {useState} from "react";
import DefaultLayout from "./layout/DefaultLayout.tsx";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

export default function () {
    const [cookies] = useCookies(['cart']);
    const [listProduct, setListProduct] = useState<any[]>([])
    const queryClient = useQueryClient();
    const {t} = useTranslation()
    const {
        data: {totalAmount} = {},
        isLoading,
        refetch,
    } = useQuery(['myCart'], async () => {
        const res = await DysonApi.getCart(cookies.cart);
        const listData = await Promise.all(res.products.map(async (e: any) => {
            const product = await DysonApi.getProductById(e.productId);
            return {
                ...product,
                quantity: e.quantity,
                color: e.color,
                size: e.size
            }
        }))

        const totalAmount = listData.reduce((acc: number, cur: any) => acc + cur.currentPrice * cur.quantity, 0)
        setListProduct(listData)
        return {
            totalAmount
        }
    }, {
        enabled: !!cookies.cart
    })


    const handleChangeQuantity = async ({productId, quantity, type, color, size}) => {
        try {
            await DysonApi.updateCart(cookies.cart, {
                productId,
                quantity,
                type,
                color,
                size
            })
            await refetch()
            await queryClient.invalidateQueries('myCartQuantity')
        } catch (error: any) {
            toast.error(t("Lỗi cập nhật giỏ hàng"))
        }
    }
    return (
        <DefaultLayout>
            <div className="cart-table-area section-padding-100">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <div className="cart-title mt-50">
                                <h2>{t("Giỏ hàng")}</h2>
                            </div>

                            <div className="cart-table clearfix">
                                <table className="table table-responsive">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>{t("Tên")}</th>
                                        <th>{t("Giá tiền")}</th>
                                        <th>{t("Số lượng")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        isLoading ?
                                            <tr>
                                                <Skeleton/>
                                            </tr>
                                            : listProduct && listProduct.map((e: any) => (
                                            <ProductCardInfo
                                                key={e._id}
                                                id={e._id}
                                                name={e.name}
                                                price={e.currentPrice}
                                                quantity={e.quantity}
                                                image={e.images[0]}
                                                color={e.color}
                                                size={e.size}
                                                handleChangeQuantity={handleChangeQuantity}
                                            />
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="cart-summary">
                                <h5>{t("Tổng thanh toán")}</h5>
                                <ul className="summary-table">
                                    <li><span>{t("Số tiền đơn hàng")}:</span>
                                        <span>{totalAmount?.toLocaleString('vi-VN')}₫</span></li>
                                    <li><span>{t("Chi phí vận chuyển")}:</span> <span>0₫</span></li>
                                    <li><span>{t("Tổng cộng")}:</span>
                                        <span>{totalAmount?.toLocaleString('vi-VN')}₫</span></li>
                                </ul>
                                <div className="cart-btn mt-100">
                                    <Link
                                        to={'/checkout'}
                                        className="btn amado-btn w-100"
                                    >
                                        {t("Tạo đơn hàng")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}
