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
import { AccountRecordDTO } from '../../service/dto/account-record.dto';
import { AccountRecordService } from '../../service/account-record.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/account-records')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('account-records')
export class AccountRecordController {
    logger = new Logger('AccountRecordController');

    constructor(private readonly accountRecordService: AccountRecordService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AccountRecordDTO,
    })
    async getAll(@Req() req: Request): Promise<AccountRecordDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.accountRecordService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: req.query.where ? JSON.parse(req.query.where) : null
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: AccountRecordDTO,
    })
    async getOne(@Param('id') id: number): Promise<AccountRecordDTO> {
        return await this.accountRecordService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create accountRecord' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AccountRecordDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() accountRecordDTO: AccountRecordDTO): Promise<AccountRecordDTO> {
        const created = await this.accountRecordService.save(accountRecordDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AccountRecord', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update accountRecord' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AccountRecordDTO,
    })
    async put(@Req() req: Request, @Body() accountRecordDTO: AccountRecordDTO): Promise<AccountRecordDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AccountRecord', accountRecordDTO.id);
        return await this.accountRecordService.update(accountRecordDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update accountRecord with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AccountRecordDTO,
    })
    async putId(@Req() req: Request, @Body() accountRecordDTO: AccountRecordDTO): Promise<AccountRecordDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AccountRecord', accountRecordDTO.id);
        return await this.accountRecordService.update(accountRecordDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete accountRecord' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'AccountRecord', id);
        return await this.accountRecordService.deleteById(id);
    }
}
