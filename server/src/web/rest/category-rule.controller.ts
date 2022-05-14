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
import { CategoryRuleDTO } from '../../service/dto/category-rule.dto';
import { CategoryRuleService } from '../../service/category-rule.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/category-rules')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('category-rules')
export class CategoryRuleController {
    logger = new Logger('CategoryRuleController');

    constructor(private readonly categoryRuleService: CategoryRuleService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CategoryRuleDTO,
    })
    async getAll(@Req() req: Request): Promise<CategoryRuleDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.categoryRuleService.findAndCount({
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
        type: CategoryRuleDTO,
    })
    async getOne(@Param('id') id: number): Promise<CategoryRuleDTO> {
        return await this.categoryRuleService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create categoryRule' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CategoryRuleDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() categoryRuleDTO: CategoryRuleDTO): Promise<CategoryRuleDTO> {
        const created = await this.categoryRuleService.save(categoryRuleDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CategoryRule', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update categoryRule' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CategoryRuleDTO,
    })
    async put(@Req() req: Request, @Body() categoryRuleDTO: CategoryRuleDTO): Promise<CategoryRuleDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CategoryRule', categoryRuleDTO.id);
        return await this.categoryRuleService.update(categoryRuleDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update categoryRule with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CategoryRuleDTO,
    })
    async putId(@Req() req: Request, @Body() categoryRuleDTO: CategoryRuleDTO): Promise<CategoryRuleDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CategoryRule', categoryRuleDTO.id);
        return await this.categoryRuleService.update(categoryRuleDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete categoryRule' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'CategoryRule', id);
        return await this.categoryRuleService.deleteById(id);
    }
}
