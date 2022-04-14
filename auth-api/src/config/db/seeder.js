import bcrypt from 'bcrypt';
import User from '../../modules/user/model/User.js';

export async function createInitialData() {
    try {
        await User.sync();

        let password = await bcrypt.hash("123456", 10);
    
        let firstUser = await User.create({
            name: "Teste user",
            email: "teste@email.com",
            password: password
        });

        console.log(firstUser);
    } catch (error) {
        console.error(error.message);
    }
}