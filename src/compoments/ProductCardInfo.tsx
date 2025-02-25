import PropTypes, { InferProps } from 'prop-types';
import { useEffect, useState } from 'react';

export default function ProductCardInfo({ id, name, price, image, color, size, quantity, handleChangeQuantity }: InferProps<typeof ProductCardInfo.propTypes>): JSX.Element {
    const [currentQuantity, setCurrentQuantity] = useState<number>(quantity)
    useEffect(() => {
        setCurrentQuantity(quantity)
    }, [quantity])
    return (
        <tr>
            <td className="cart_product_img">
                <a href="#"><img src={image} alt="Product" /></a>
            </td>
            <td className="cart_product_desc">
                <h5>{name}</h5>
                <h5>Color: {color}</h5>
                <h5>Size: {size}</h5>
            </td>
            <td className="price">
                <span>{price.toLocaleString('vi-VN')}₫</span>
            </td>
            <td className="qty">
                <div className="qty-btn d-flex">
                    <div className="quantity">
                        <span className="qty-minus" onClick={() => {
                            handleChangeQuantity(
                                {
                                    productId: id,
                                    quantity: 1,
                                    type: 'decrease',
                                    color: color,
                                    size: size,
                                }
                            ).then()
                        }}><i className="fa fa-minus" aria-hidden="true"></i></span>
                        <input
                            type="number"
                            className="qty-text"
                            id="qty"
                            step={1}
                            min={0}
                            name="quantity"
                            value={currentQuantity}
                            onChange={(e) => setCurrentQuantity(e.target.valueAsNumber)}
                            onBlur={(e) => {
                                const value = e.target.valueAsNumber
                                handleChangeQuantity(
                                    {
                                        productId: id,
                                        quantity: Math.abs(value - quantity),
                                        type: value - quantity > 0 ? 'increase' : 'decrease',
                                        color: color,
                                        size: size,
                                    }
                                ).then()
                            }
                            }
                        />
                        <span className="qty-plus" onClick={() => {
                            handleChangeQuantity(
                                {
                                    productId: id,
                                    quantity: 1,
                                    type: 'increase',
                                    color: color,
                                    size: size,
                                }
                            ).then()
                        }}><i className="fa fa-plus" aria-hidden="true"></i></span>
                    </div>
                </div>
            </td>
        </tr>
    )
}

ProductCardInfo.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    handleChangeQuantity: PropTypes.func.isRequired,
}
