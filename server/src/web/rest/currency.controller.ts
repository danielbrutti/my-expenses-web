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
import { CurrencyDTO } from '../../service/dto/currency.dto';
import { CurrencyService } from '../../service/currency.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/currencies')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('currencies')
export class CurrencyController {
    logger = new Logger('CurrencyController');

    constructor(private readonly currencyService: CurrencyService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CurrencyDTO,
    })
    async getAll(@Req() req: Request): Promise<CurrencyDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.currencyService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/all')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records without pagination',
        type: CurrencyDTO,
    })
    async getAllNotPaginated(@Req() req: Request): Promise<CurrencyDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.currencyService.findAndCount({order: pageRequest.sort.asOrder()});
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CurrencyDTO,
    })
    async getOne(@Param('id') id: number): Promise<CurrencyDTO> {
        return await this.currencyService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create currency' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CurrencyDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() currencyDTO: CurrencyDTO): Promise<CurrencyDTO> {
        const created = await this.currencyService.save(currencyDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Currency', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update currency' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CurrencyDTO,
    })
    async put(@Req() req: Request, @Body() currencyDTO: CurrencyDTO): Promise<CurrencyDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Currency', currencyDTO.id);
        return await this.currencyService.update(currencyDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update currency with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CurrencyDTO,
    })
    async putId(@Req() req: Request, @Body() currencyDTO: CurrencyDTO): Promise<CurrencyDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Currency', currencyDTO.id);
        return await this.currencyService.update(currencyDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete currency' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Currency', id);
        return await this.currencyService.deleteById(id);
    }
}
