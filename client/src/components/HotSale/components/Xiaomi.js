import React, { useEffect, useState } from 'react';
import axios from 'axios'
import ListProduct from '../ListProduct'
import {handlePercentDiscount} from '../../../untils/index'
import { useDispatch } from 'react-redux';

function Xiaomi(props) {
    const dispatch = useDispatch()
    const [name] = useState('xiaomi');
    const [hotXiaomi, setHotXiaomi] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function FetchApi(){
            try {
                setLoading(true)
                console.log('Đang gọi API...')
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

                    setHotXiaomi(normalizedProducts)
                    setError(null)
                } else {
                    setError('Không tìm thấy sản phẩm Xiaomi hợp lệ.')
                    setHotXiaomi([])
                }
            } catch (error) {
                if (!isMounted) return
                
                console.error('Lỗi khi tải dữ liệu Xiaomi:', error)
                const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải dữ liệu.'
                setError(errorMessage)
                setHotXiaomi([])
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
        if (!Array.isArray(hotXiaomi) || hotXiaomi.length === 0) {
            return []
        }
        return handlePercentDiscount(hotXiaomi)
    }, [hotXiaomi])

    if (loading) {
        return (
            <section id="hotsale">
                <div className="hotsale">
                    <h2>Xiaomi</h2>
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
                <h2>Xiaomi</h2>
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

export default Xiaomi;