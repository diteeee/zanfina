module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define("Teacher", {
        teacherID: {
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
        nrTel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        specializimi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Teacher;
};