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
import { BudgetDTO } from '../../service/dto/budget.dto';
import { BudgetService } from '../../service/budget.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/budgets')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('budgets')
export class BudgetController {
    logger = new Logger('BudgetController');

    constructor(private readonly budgetService: BudgetService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: BudgetDTO,
    })
    async getAll(@Req() req: Request): Promise<BudgetDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.budgetService.findAndCount({
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
        type: BudgetDTO,
    })
    async getOne(@Param('id') id: number): Promise<BudgetDTO> {
        return await this.budgetService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create budget' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: BudgetDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() budgetDTO: BudgetDTO): Promise<BudgetDTO> {
        const created = await this.budgetService.save(budgetDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Budget', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update budget' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BudgetDTO,
    })
    async put(@Req() req: Request, @Body() budgetDTO: BudgetDTO): Promise<BudgetDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Budget', budgetDTO.id);
        return await this.budgetService.update(budgetDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update budget with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BudgetDTO,
    })
    async putId(@Req() req: Request, @Body() budgetDTO: BudgetDTO): Promise<BudgetDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Budget', budgetDTO.id);
        return await this.budgetService.update(budgetDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete budget' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Budget', id);
        return await this.budgetService.deleteById(id);
    }
}
