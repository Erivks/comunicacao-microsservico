const env = process.env;

export const apiSecret = env.API_SECRET ? env.API_SECRET : "YXV0aC1hcGktc2VjcmV0LWRldg==";

export const RABBIT_MQ_URL = env.RABBIT_MQ_URL ? env.RABBIT_MQ_URL : "amqp://localhost:5672";

export const PRODUCT_API_URL = env.PRODUCT_API_URL ? env.PRODUCT_API_URL : 'http://localhost:8081/api/product';