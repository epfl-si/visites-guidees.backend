import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UseGuards, Req } from '@nestjs/common';
import { AzureAdGuard } from '../../auth/azure-ad-auth.guard';

@Controller('api/user')
export class UserController {
    @UseGuards(AzureAdGuard)
    @Get('me')
    getProtected(@Req() req) {
        console.log('User info:', req.user);
        return { user: req.user };
    }
}
