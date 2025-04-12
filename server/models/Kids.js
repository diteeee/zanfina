module.exports = (sequelize, DataTypes) => {
    const Kid = sequelize.define("Kid", {
        kidID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mbiemri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ditelindja: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Kid.associate = (models) => {
        Kid.belongsTo(models.User, {
            foreignKey: {
                name: 'parentID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.User.hasMany(Kid, { foreignKey: 'parentID' });
    };

    return Kid;
};