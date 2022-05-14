import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { CategoryRuleDTO } from '../src/service/dto/category-rule.dto';
import { CategoryRuleService } from '../src/service/category-rule.service';

describe('CategoryRule Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(CategoryRuleService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all category-rules ', async () => {
        const getEntities: CategoryRuleDTO[] = (
            await request(app.getHttpServer()).get('/api/category-rules').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET category-rules by id', async () => {
        const getEntity: CategoryRuleDTO = (
            await request(app.getHttpServer())
                .get('/api/category-rules/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create category-rules', async () => {
        const createdEntity: CategoryRuleDTO = (
            await request(app.getHttpServer()).post('/api/category-rules').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update category-rules', async () => {
        const updatedEntity: CategoryRuleDTO = (
            await request(app.getHttpServer()).put('/api/category-rules').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update category-rules from id', async () => {
        const updatedEntity: CategoryRuleDTO = (
            await request(app.getHttpServer())
                .put('/api/category-rules/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE category-rules', async () => {
        const deletedEntity: CategoryRuleDTO = (
            await request(app.getHttpServer())
                .delete('/api/category-rules/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
