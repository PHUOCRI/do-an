import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:4000/api'

async function registerUser() {
    try {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: '123456'
            })
        })
        const data = await response.json()
        console.log('Đăng ký thành công:', data)
        return data.token
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error)
    }
}

async function getProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products/all`)
        const products = await response.json()
        console.log('Danh sách sản phẩm:', products)
        return products
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error)
    }
}

async function createSelectList(token, productIds) {
    try {
        const response = await fetch(`${BASE_URL}/selectlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                products: productIds
            })
        })
        const data = await response.json()
        console.log('Tạo selectlist thành công:', data)
        return data
    } catch (error) {
        console.error('Lỗi khi tạo selectlist:', error)
    }
}

async function main() {
    // 1. Đăng ký user
    const token = await registerUser()
    if (!token) {
        console.log('Không thể đăng ký user')
        return
    }

    // 2. Lấy danh sách sản phẩm
    const products = await getProducts()
    if (!products || products.length === 0) {
        console.log('Không có sản phẩm')
        return
    }

    // 3. Tạo selectlist với sản phẩm đầu tiên
    const productIds = [products[0]._id]
    await createSelectList(token, productIds)
}

main() 