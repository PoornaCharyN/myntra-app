import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.scss'
import { useCart } from '../../Components/NavPages/AddToCartPage/CartContext';

interface Product {
    id: number;
    title: string;
    image: string;
    description: string;
    price: number;
}

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams();
    const {cart, dispatch}=useCart()
    const [isAddedToBag, setIsAddedToBag]=useState(false)
    const [product, setProduct] = useState<Product | null>(null); // Initialize with null
    const [wishListItems, setWhishListItems] = useState<number[]>([])
    const handleAddToWishList = (id: number) => {
        if (wishListItems.includes(id)) {
            const updatedWishList = wishListItems.filter((item) => item !== id)
            setWhishListItems(updatedWishList)
            // alert('removed')
        } else {
            setWhishListItems([...wishListItems, id])

            // alert('added')
        }
    }
    const productInCart = product ? cart.items.find((item: { id: number; }) => item.id === product.id) : null;

    useEffect(()=>{
        if(productInCart){
            setIsAddedToBag(true)
        }
    },[productInCart])
    const handleAddToCart=(product: any)=>{
        dispatch({type:'ADD_TO_CART',payload:product})
        setIsAddedToBag(true)

    }

    useEffect(() => {
        axios
            .get(`https://fakestoreapi.com/products/${productId}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
    }, [productId]);

    return (
        <div>
            {product ? (
                <div className='product-detail-page'>
                    {/* <h2>Product Detail</h2> */}

                    <img src={product.image} alt={product.title} />
                    <div className='detail-card'>
                        <h3>{product.title}</h3>
                        <p>{product.description}</p>
                        <h4>Price: {product.price} Rs/-</h4>
                        <span className='product-detail-button'>
                            <button onClick={()=>{
                               if(!isAddedToBag){
                                handleAddToCart(product)
                               }
                            }}disabled={isAddedToBag} style={{ background: "#ff3f6c", border: "none", color: '#ffff', marginRight: '2rem' }}>
                                {isAddedToBag?'Added to Bag':'Add To Bag'} <i className="fa-solid fa-bag-shopping nav_icon"></i>
                            </button>
                            <button
                                onClick={() => handleAddToWishList(product.id)}
                                style={{
                                    border: wishListItems.includes(product.id) ? 'none' : '1px solid #ff3f6c',
                                    background: wishListItems.includes(product.id) ? 'grey' : 'transparent',
                                    color: wishListItems.includes(product.id) ? 'white' : 'black'
                                }}
                            >
                                {wishListItems.includes(product.id) ? 'Wishlisted' : 'Wishlist'}   <i
                                    className="fa-solid fa-heart nav_icon"
                                    style={{
                                        color: wishListItems.includes(product.id) ? 'red' : 'grey',
                                    }}
                                ></i>

                            </button>

                        </span>
                    </div>

                   
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProductDetailPage;
