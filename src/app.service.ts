import { Injectable } from '@nestjs/common';
import { RiotDeveloperConfig } from './types/riot-developer-config.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getRiotDeveloperConfig(): RiotDeveloperConfig {
    return {
      apiKey: process.env.RIOT_DEVELOPER_API_KEY,
      baseUrl: process.env.RIOT_DEVELOPER_BASE_URL
    };
  }
  
  getDbConfig() {
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
  }
}
