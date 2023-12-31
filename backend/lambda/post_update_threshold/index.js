const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing request body",
            }),
        };
    }

    const requestBody = JSON.parse(event.body);
    const { plant_id, min_water_level, min_moisture_level } = requestBody;

    if (!plant_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid request parameters",
            }),
        };
    }

    // Create an item to update in DynamoDB
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { plant_id },
        UpdateExpression: "SET min_water_level = :min_water_level, min_moisture_level = :min_moisture_level",
        ExpressionAttributeValues: {
            ":min_water_level": min_water_level,
            ":min_moisture_level": min_moisture_level,
        },
        ReturnValues: "ALL_NEW", // Change this as needed
    };

    try {
        const data = await dynamoDb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Threshold data updated",
                data: data.Items,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error updating threshold data",
                error: error.message,
            }),
        };
    }
};
