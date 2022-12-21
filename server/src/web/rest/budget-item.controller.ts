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
import { BudgetItemDTO } from '../../service/dto/budget-item.dto';
import { BudgetItemService } from '../../service/budget-item.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/budget-items')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('budget-items')
export class BudgetItemController {
    logger = new Logger('BudgetItemController');

    constructor(private readonly budgetItemService: BudgetItemService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: BudgetItemDTO,
    })
    async getAll(@Req() req: Request): Promise<BudgetItemDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.budgetItemService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: req.query.where ? JSON.parse(req.query.where) : null
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/all')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records without pagination',
        type: BudgetItemDTO,
    })
    async getAllNotPaginated(@Req() req: Request): Promise<BudgetItemDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.budgetItemService.findAndCount({order: pageRequest.sort.asOrder()});
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: BudgetItemDTO,
    })
    async getOne(@Param('id') id: number): Promise<BudgetItemDTO> {
        return await this.budgetItemService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create budgetItem' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: BudgetItemDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() budgetItemDTO: BudgetItemDTO): Promise<BudgetItemDTO> {
        const created = await this.budgetItemService.save(budgetItemDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BudgetItem', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update budgetItem' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BudgetItemDTO,
    })
    async put(@Req() req: Request, @Body() budgetItemDTO: BudgetItemDTO): Promise<BudgetItemDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BudgetItem', budgetItemDTO.id);
        return await this.budgetItemService.update(budgetItemDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update budgetItem with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BudgetItemDTO,
    })
    async putId(@Req() req: Request, @Body() budgetItemDTO: BudgetItemDTO): Promise<BudgetItemDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BudgetItem', budgetItemDTO.id);
        return await this.budgetItemService.update(budgetItemDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete budgetItem' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'BudgetItem', id);
        return await this.budgetItemService.deleteById(id);
    }
}
