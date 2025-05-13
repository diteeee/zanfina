module.exports = (sequelize, DataTypes) => {
    const Supply = sequelize.define("Supply", {
        supplyID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sasia: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Supply.associate = (models) => {
        Supply.belongsTo(models.Class, {
            foreignKey: {
                name: 'supplyClassID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Class.hasMany(Supply, { foreignKey: 'supplyClassID' });
    };

    return Supply;
};