import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log('Mongodb uri ->', process.env.DB_URI);
        return {
          uri: process.env.DB_URI,
          dbName: process.env.DB_NAME,
        };
      },
    }),
  ],
})
export class DatabaseModel {}
