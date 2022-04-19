import Order from "../../modules/sales/model/Order.js";

export async function createInitialData() {
    await Order.collection.drop();
    let firstOrder = await Order.create({
        products: [
            {
                productId: 1001,
                quantity: 3
            },
            {
                productId: 1002,
                quantity: 2
            },
            {
                productId: 1003,
                quantity: 1
            }
        ],
        user: {
            id: "hd879q2y83e7",
            name: "User Test",
            email: "user@test.com"
        },
        status: "APPROVED",
        createdAt: new Date(),
        updatedAt: new Date()
    });
    let secondOrder = await Order.create({
        products: [
            {
                productId: 1001,
                quantity: 4
            },
            {
                productId: 1003,
                quantity: 2
            }
        ],
        user: {
            id: "hd879q2y83e434",
            name: "User Test 2",
            email: "user2@test.com"
        },
        status: "REJECTED",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    let initialData = await Order.find();
}