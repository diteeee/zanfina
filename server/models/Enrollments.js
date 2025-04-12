module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define("Enrollment", {
        enrollmentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        data: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Enrollment.associate = (models) => {
        Enrollment.belongsTo(models.Kid, {
            foreignKey: {
                name: 'enrollmentKidID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Kid.hasMany(Enrollment, { foreignKey: 'enrollmentKidID' });

        Enrollment.belongsTo(models.Class, {
            foreignKey: {
                name: 'enrollmentClassID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Class.hasMany(Enrollment, { foreignKey: 'enrollmentClassID' });
    };

    return Enrollment;
};