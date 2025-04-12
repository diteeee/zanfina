module.exports = (sequelize, DataTypes) => {
    const Meal = sequelize.define("Meal", {
        mealID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pershkrimi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orari: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Meal;
};