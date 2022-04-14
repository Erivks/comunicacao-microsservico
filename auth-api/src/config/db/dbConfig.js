import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("auth-db", "admin", "123456", {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    quoteIdentifiers: false,
    define: {
        //syncOnAssociation: true,
        timestamps: false,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
    }
});

await sequelize.authenticate().then(() => {
    console.log("Connection has been stablished!");
}).catch((err) => {
    console.error("Unable to connect to the database");
    console.error(err.message);
});

export default sequelize;