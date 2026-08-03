import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AzureAdModule } from './auth/azure-ad.module';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'azure-ad' }),
    ReservationModule,
    UserModule,
    PlaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
