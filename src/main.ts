import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

    const options = new DocumentBuilder()
        .setTitle('Web Push Server')
        .setDescription('The Web Push Server API description')
        .setVersion('1.0')
        .addTag('Web Push server')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
