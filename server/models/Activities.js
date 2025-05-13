module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define("Activity", {
        activityID: {
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
        data: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Activity.associate = (models) => {
        Activity.belongsTo(models.Teacher, {
            foreignKey: {
                name: 'activityTeacherID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Teacher.hasMany(Activity, { foreignKey: 'activityTeacherID' });
    };

    return Activity;
};