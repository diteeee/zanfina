module.exports = (sequelize, DataTypes) => {
    const HealthRecord = sequelize.define("HealthRecord", {
        healthRecordID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        alergjite: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        medicalConditions: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gjaku: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    HealthRecord.associate = (models) => {
        HealthRecord.belongsTo(models.Kid, {
            foreignKey: {
                name: 'healthRecordKidID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Kid.hasMany(HealthRecord, { foreignKey: 'healthRecordKidID' });
    };

    return HealthRecord;
};