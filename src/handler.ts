import { SQSEvent, SQSHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { UserData } from './model';

const TABLE_NAME = process.env.TABLE_NAME!;
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: SQSHandler = async (event: SQSEvent) => {
    console.info(`Lambda invoked with ${event.Records.length} messages`);

    for (const record of event.Records) {
        try {
            console.debug(`Message received: ${record.body}`);
            const snsPayload = JSON.parse(record.body);

            // 👇 Pega a chave correta, padrão AWS ou customizada
            const rawMessage = snsPayload.Message ?? snsPayload.Mensagem;
            if (!rawMessage) {
                throw new Error("Message key not found in SNS payload");
            }

            // 👇 Extrai o evento do SNS
            const userEvent = JSON.parse(rawMessage);

            // 👇 Extrai o payload final (UserData)
            const userData = typeof userEvent.data === 'string'
                ? JSON.parse(userEvent.data)
                : userEvent.data;

            if (!userData?.identification) {
                throw new Error(`Missing identification key in userData: ${JSON.stringify(userData)}`);
            }

            console.info(`Saving user to DynamoDB: ${JSON.stringify(userData)}`);

            // 👇 Salva no DynamoDB
            await docClient.send(new PutCommand({
                TableName: TABLE_NAME,
                Item: userData
            }));

            console.info(`Inserted item ${userData.identification}`);
        } catch (err) {
            console.error(`Error processing message: ${(err as Error).message}`, err);
        }
    }
};
