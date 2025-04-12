module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define("Class", {
        classID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        emri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orari: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Class.associate = (models) => {
        Class.belongsTo(models.Teacher, {
            foreignKey: {
                name: 'classTeacherID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Teacher.hasMany(Class, { foreignKey: 'classTeacherID' });
    };

    return Class;
};