    // export const SortProductByDiscount = (products) => {
    //     products.sort((a,b) => {
    //         return (b.price - b.salePrice) - (a.price - a.salePrice);
    //     })
    //     const newSaleProducts = products.slice(0, 5);
        
    //     return handlePercentDiscount(newSaleProducts);
    // }

    export const handlePercentDiscount = (products) => { 
        // Kiểm tra nếu products không tồn tại hoặc không phải là mảng
        if (!products) {
            console.warn('handlePercentDiscount: products là null hoặc undefined')
            return []
        }

        // Đảm bảo products là mảng
        const productsArray = Array.isArray(products) ? products : [products]

        try {
            const newList = productsArray
                .filter(product => product && typeof product === 'object') // Lọc ra các object hợp lệ
                .map(product => {
                    const { price, salePrice } = product

                    // Chuyển đổi giá thành số nếu là string
                    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
                    const numericSalePrice = typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice

                    // Kiểm tra giá có hợp lệ không
                    if (typeof numericPrice !== 'number' || typeof numericSalePrice !== 'number' || 
                        isNaN(numericPrice) || isNaN(numericSalePrice)) {
                        console.warn('handlePercentDiscount: giá không hợp lệ:', { price, salePrice })
                        return { ...product, percentDiscount: 0 }
                    }

                    // Tính toán phần trăm giảm giá
                    const percentDiscount = numericPrice > 0 
                        ? Math.max(0, Math.min(100, Math.round((numericPrice - numericSalePrice) * 100 / numericPrice)))
                        : 0

                    return { ...product, percentDiscount }
                })

            return newList
        } catch (error) {
            console.error('handlePercentDiscount error:', error)
            return []
        }
    }

    export const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat('vi')
        return formatter.format(price)
    }

    export const getFirstCharacterUser = (name) => {
        const arrCharacter = name.split('')[0]
        return arrCharacter
    } 

    export const formatDateOrderPaypal = (timestamp) => {
        const d = new Date( timestamp );
        const date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
        return date
    } 
    