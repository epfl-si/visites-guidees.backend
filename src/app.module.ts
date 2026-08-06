import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { PlaceModule } from './place/place.module';
import { GuideModule } from './guide/guide.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'azure-ad' }),
    ReservationModule,
    UserModule,
    PlaceModule,
    GuideModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
