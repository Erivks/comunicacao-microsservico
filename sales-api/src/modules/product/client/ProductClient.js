import axios from 'axios';

import { PRODUCT_API_URL } from '../../../config/constants/secrets.js';
import HTTP_CODE from '../../../config/constants/httpStatus.js';

class ProductClient {
    async checkProductStock(products, token) {
        try {
            const headers = {
                Authorization: token
            };

            console.info(`Sending request to Product API with data: ${JSON.stringify(products)}`);
            let response = false;
            axios
                .post(
                    `${PRODUCT_API_URL}/check-stock`, 
                    { products: products.products }, 
                    { headers }
                )
                .then((res) => {
                    response = true;
                })
                .catch((err) => {
                    response = false;
                })
            
            return response;
        } catch (err) {
            return false;
        }
    }
}

export default new ProductClient();