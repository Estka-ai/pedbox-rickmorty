import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IngestService } from './ingest.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingestService = app.get(IngestService);
  const result = await ingestService.run();
  console.log('Ingest result:', result);
  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('Ingest failed:', error);
  process.exit(1);
});
