import { Client, Account, ID } from 'appwrite'

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITER_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITER_PROJECT_ID);

