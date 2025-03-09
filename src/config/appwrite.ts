import { Client, Storage, Account, } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67cd6cbb00384883a744')

export const storage = new Storage(client);
export const account = new Account(client);
export const BUCKET_ID = '67cd70ba000d8398d389';