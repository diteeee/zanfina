module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define("Feedback", {
        feedbackID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        teksti: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.User, {
            foreignKey: {
                name: 'parentID',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.User.hasMany(Feedback, { foreignKey: 'parentID' });
    };

    return Feedback;
};