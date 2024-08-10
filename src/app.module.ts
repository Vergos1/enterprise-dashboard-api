import { DynamicModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MemoriesModule } from './memories/memories.module';
import { RolesModule } from './roles/roles.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';

const infrastructureDatabaseModule: DynamicModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

const configModule: DynamicModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig, authConfig],
  envFilePath: ['.env'],
});

@Module({
  imports: [
    configModule,
    infrastructureDatabaseModule,
    AppLoggerModule,
    UsersModule,
    AuthModule,
    MemoriesModule,
    RolesModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
