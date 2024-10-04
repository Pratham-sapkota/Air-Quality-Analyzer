import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModel } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AqiSchema } from './schemas/aqi.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModel,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Aqi_model', schema: AqiSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
