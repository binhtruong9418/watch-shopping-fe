import { Link } from 'react-router-dom'
import CardImg from '../assets/img/cart.png'
import PropTypes, { InferProps } from 'prop-types'
import {upperCaseFirstLetter} from "../utils";

export default function ShopCard({ id, images, name, currentPrice, discount, price }: InferProps<typeof ShopCard.propTypes>) {
    return (
        <Link className="col-12 col-sm-6 col-md-12 col-xl-6" to={`/product/${id}`}>
            <div className="single-product-wrapper" style={{ cursor: 'pointer' }} >
                <div className="product-img">
                    <img src={images[0]} className={''} alt="" />
                    <img className="hover-img" src={images[1] ? images[1] : images[0]} alt="" />
                </div>
                <div className="product-description d-flex align-items-center justify-content-between">
                    <div className="product-meta-data">
                        <div className="line"></div>
                        <div className={'d-flex'}>
                            <p className="product-price">{currentPrice.toLocaleString('vi-VN')}₫</p>
                            {
                                currentPrice !== price && (
                                    <>
                                        <p className={'ml-2'}>{price.toLocaleString('vi-VN')}₫</p>
                                        <p className={'ml-2 text-danger'}>-{discount?.toFixed(0)}%</p>
                                    </>
                                )
                            }
                        </div>

                        <a href="#">
                            <h6>{upperCaseFirstLetter(name)}</h6>
                        </a>
                    </div>
                    <div className="ratings-cart text-right">
                        <div className="ratings">
                        <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                        </div>
                        <div className="cart">
                            <a href="#" data-toggle="tooltip" data-placement="left" title="Thêm vào giỏ hàng">
                                <img src={CardImg} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

ShopCard.propTypes = {
    id: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    currentPrice: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired
}
