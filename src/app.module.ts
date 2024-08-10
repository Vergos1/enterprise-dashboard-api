import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './app-logger/app-logger.module';
import databaseConfig from './database/config/database.config';

const infrastructureDatabaseModule: DynamicModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

const configModule: DynamicModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig],
  envFilePath: ['.env'],
});

@Module({
  imports: [configModule, infrastructureDatabaseModule, AppLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
