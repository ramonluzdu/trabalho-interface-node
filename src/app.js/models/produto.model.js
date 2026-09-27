const { DataTypes } = require("sequelize");

function defineProduto(sequelize) {
    return sequelize.define("Produto", {
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: 0, isFloat: true }
        }
    });
}

module.exports = defineProduto;
