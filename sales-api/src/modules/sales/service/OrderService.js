import OrderRepository from "../repository/OrderRepository.js";
import { sendMessageToProductStockUpdateQueue } from '../../product/rabbitmq/productStockUpdateSender.js'
import HTTP_CODE from '../../../config/constants/httpStatus.js';
import STATUS from "../status/OrderStatus.js";
import OrderException from '../exception/OrderException.js';
import ProductClient from "../../product/client/ProductClient.js";

class OrderService {
    async createOrder(req) {
        try {
            let orderData = req.body;
            this.validateOrderData(orderData);
            const { authUser } = req;
            const { authorization } = req.headers;
            let order = createInitialOrderData(orderData, authUser);
            await this.validateProductStock(order, authorization);            
            let createdOrder = OrderRepository.save(order);
            this.sendMessage(createdOrder);
            return {
                status: HTTP_CODE.OK,
                createdOrder
            }
        } catch (error) {
            return {
                status: error.status ? error.status : HTTP_CODE.INTERNAL_SERVER_ERROR,
                message: error.message 
            }
        }
    }

    async updateOrder(orderMessage) {
        try {
            const order = JSON.parse(orderMessage);
            if (order.salesId && order.status) {
                let existingOrder = await OrderRepository.findById(order.salesId);
                if (existingOrder && order.status !== existingOrder.status) {
                    existingOrder.status = order.status;
                    existingOrder.updatedAt = new Date();
                    await OrderRepository.save(existingOrder);
                }
            } else {
                console.warn("The order message was not complete.");
            }
        } catch (error) {
            console.error("Could not parse order message from queue.");
            console.error(error.message);
        }
    }

    validateOrderData(data) {
        if (!data || !data.products) {
            throw new OrderException(HTTP_CODE.BAD_REQUEST, "The products must be informed.");
        }
    }

    createInitialOrderData(orderData, authUser) {
        return {
            status: STATUS.PENDING,
            user: authUser,
            createdAt: new Date(),
            updatedAt: new Date(),
            products: orderData.products
        };
    }

    sendMessage(order) {
        const message = {
            saledId: order.id,
            products: order.products
        };
        sendMessageToProductStockUpdateQueue(order.products);

    }

    async findById(req) {
        try {
            const { id } = req.params;
            this.validateInformedId(id);
            const existingOrder = await OrderRepository.findById(id);
            if (!existingOrder) {
                throw OrderException(HTTP_CODE.BAD_REQUEST, "The order was not found.");
            }
            return {
                status: HTTP_CODE.OK,
                existingOrder
            }
        } catch (err) {
            return {
                status: err.status ? err.status : HTTP_CODE.INTERNAL_SERVER_ERROR,
                message: err.message
            }
        }
    }

    async findAll() {
        try {
            const orders = await OrderRepository.findAll();
            if (!orders) {
                throw OrderException(HTTP_CODE.BAD_REQUEST, "No orders were found.");
            }
            return {
                status: HTTP_CODE.OK,
                orders
            }
        } catch (err) {
            return {
                status: err.status ? err.status : HTTP_CODE.INTERNAL_SERVER_ERROR,
                message: err.message
            }
        }
    }

    async findByProductId(req) {
        try {
            const { id } = req.params;
            this.validateInformedId(id);
            const existingOrder = await OrderRepository.findByProductId(id);
            if (!existingOrder) {
                throw OrderException(HTTP_CODE.BAD_REQUEST, "The order was not found.");
            }
            return {
                status: HTTP_CODE.OK,
                salesId: existingOrder.map((order) => {
                    return order.id
                })
            }
        } catch (err) {
            return {
                status: err.status ? err.status : HTTP_CODE.INTERNAL_SERVER_ERROR,
                message: err.message
            }
        }
    }

    validateInformedId(id) {
        if (!id) {
            throw new OrderException(HTTP_CODE.BAD_REQUEST, "The order ID must be informed.");
        }
    }

    async validateProductStock(order, token) {
        let stockIsOut = await ProductClient.checkProductStock(order.products, token);
        if (stockIsOut) {
            throw new OrderException(
                HTTP_CODE.BAD_REQUEST,
                "The stock is out for the products."
            );
        }
    }
}

export default new OrderService();