import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  const config = new DocumentBuilder()
    .setTitle('AQI report API')
    .setDescription('API to generate reports and uplaod them based on data.')
    .setVersion('1.0')
    // .addTag('aqi')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log(`Server started at ${port}`);
    console.log('Swagger API in http://localhost:3000/api');
  });
}
bootstrap();
