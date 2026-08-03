import { Module } from '@nestjs/common';
import { AzureAdStrategy } from './azure-ad.strategy';

@Module({
    providers: [AzureAdStrategy],
})

export class AzureAdModule { }
