import React, { useEffect, useState } from 'react';
import axios from 'axios'
import ListProduct from '../ListProduct'
import {handlePercentDiscount} from '../../../untils/index'
import { useDispatch } from 'react-redux';
import { config } from '../../../config/config.js';

function Samsung(props) {
    const dispatch = useDispatch()
    const [name] = useState('samsung');
    const [hotSamsung, setHotSamsung] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function FetchApi(){
            try {
                setLoading(true)
                console.log('Đang gọi API Samsung...')
                const response = await axios.get(`/api/products/type/${name}`)

                if (!isMounted) return

                const responseData = response?.data

                console.log('API Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData
                })

                // Kiểm tra và xử lý dữ liệu
                if (!responseData) {
                    throw new Error('Không có dữ liệu từ API')
                }

                // Đảm bảo dữ liệu là một mảng
                const products = Array.isArray(responseData) ? responseData : [responseData]

                // Kiểm tra tính hợp lệ của từng sản phẩm
                const validProducts = products.filter(product => 
                    product && 
                    typeof product === 'object' &&
                    product.name &&
                    (typeof product.price === 'number' || !isNaN(Number(product.price))) &&
                    (typeof product.salePrice === 'number' || !isNaN(Number(product.salePrice)))
                )

                if (validProducts.length > 0) {
                    // Chuyển đổi giá thành số nếu cần
                    const normalizedProducts = validProducts.map(product => ({
                        ...product,
                        price: Number(product.price),
                        salePrice: Number(product.salePrice)
                    }))

                    setHotSamsung(normalizedProducts)
                    setError(null)
                } else {
                    setError('Không tìm thấy sản phẩm Samsung hợp lệ.')
                    setHotSamsung([])
                }
            } catch (error) {
                if (!isMounted) return
                
                console.error('Lỗi khi tải dữ liệu Samsung:', error)
                const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải dữ liệu.'
                setError(errorMessage)
                setHotSamsung([])
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        FetchApi()

        return () => {
            isMounted = false
        }
    }, [name])

    // Xử lý tính % giảm giá
    const processedProducts = React.useMemo(() => {
        if (!Array.isArray(hotSamsung) || hotSamsung.length === 0) {
            return []
        }
        return handlePercentDiscount(hotSamsung)
    }, [hotSamsung])

    if (loading) {
        return (
            <section id="hotsale">
                <div className="hotsale">
                    <h2>Samsung</h2>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        Đang tải dữ liệu...
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="hotsale">
            <div className="hotsale">
                <h2>Samsung</h2>
                {error && (
                    <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                        {error}
                    </div>
                )}
                {processedProducts.length > 0 && (
                    <ListProduct HotSaleProducts={processedProducts} />
                )}
            </div>
        </section>
    );
}

export default Samsung;