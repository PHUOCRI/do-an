import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handlePercentDiscount } from '../../untils/index';
import { searchProduct } from '../../actions/ProductAction';
import './Search.css';
import ListProduct from './ListProduct';

function Search(props) {
    const dispatch = useDispatch();
    const searchProductState = useSelector(state => state.searchProduct);
    const { products } = searchProductState;
    
    useEffect(() => {
        if ((!products || products.length === 0)) {
            const keyword = localStorage.getItem('searchKeyword');
            if (keyword) {
                dispatch(searchProduct(keyword));
            }
        }
    }, [dispatch, products]);
    
    return (
        <section id="hotsale iphone">
            <div className="hotsale">
                {
                    products && products.length > 0 ? (
                        <ListProduct HotSaleProducts={handlePercentDiscount(products)}></ListProduct>
                    ) : (
                        <h2>Không tìm thấy sản phẩm</h2>
                    )
                }
            </div>
        </section>
    );
}

export default Search;