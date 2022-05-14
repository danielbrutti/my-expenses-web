import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MoneyAccountDTO } from '../../service/dto/money-account.dto';
import { MoneyAccountService } from '../../service/money-account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/money-accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('money-accounts')
export class MoneyAccountController {
    logger = new Logger('MoneyAccountController');

    constructor(private readonly moneyAccountService: MoneyAccountService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: MoneyAccountDTO,
    })
    async getAll(@Req() req: Request): Promise<MoneyAccountDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.moneyAccountService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: MoneyAccountDTO,
    })
    async getOne(@Param('id') id: number): Promise<MoneyAccountDTO> {
        return await this.moneyAccountService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create moneyAccount' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: MoneyAccountDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() moneyAccountDTO: MoneyAccountDTO): Promise<MoneyAccountDTO> {
        const created = await this.moneyAccountService.save(moneyAccountDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'MoneyAccount', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update moneyAccount' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MoneyAccountDTO,
    })
    async put(@Req() req: Request, @Body() moneyAccountDTO: MoneyAccountDTO): Promise<MoneyAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'MoneyAccount', moneyAccountDTO.id);
        return await this.moneyAccountService.update(moneyAccountDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update moneyAccount with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MoneyAccountDTO,
    })
    async putId(@Req() req: Request, @Body() moneyAccountDTO: MoneyAccountDTO): Promise<MoneyAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'MoneyAccount', moneyAccountDTO.id);
        return await this.moneyAccountService.update(moneyAccountDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete moneyAccount' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'MoneyAccount', id);
        return await this.moneyAccountService.deleteById(id);
    }
}
