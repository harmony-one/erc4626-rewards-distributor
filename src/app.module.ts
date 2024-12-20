import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configs/config';
import { Web3Module } from 'nest-web3';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RewardsDistModule } from './rewards-dist/rewards-dist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    Web3Module.forRootAsync({
      useFactory: (configService: ConfigService) => [
        configService.get('hmy'),
      ],
      inject: [ConfigService],
    }),
    Web3Module,
    RewardsDistModule,
    PrometheusModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
