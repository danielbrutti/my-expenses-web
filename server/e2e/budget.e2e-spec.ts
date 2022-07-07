import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { BudgetDTO } from '../src/service/dto/budget.dto';
import { BudgetService } from '../src/service/budget.service';

describe('Budget Controller', () => {
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
            .overrideProvider(BudgetService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all budgets ', async () => {
        const getEntities: BudgetDTO[] = (await request(app.getHttpServer()).get('/api/budgets').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET budgets by id', async () => {
        const getEntity: BudgetDTO = (
            await request(app.getHttpServer())
                .get('/api/budgets/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create budgets', async () => {
        const createdEntity: BudgetDTO = (
            await request(app.getHttpServer()).post('/api/budgets').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update budgets', async () => {
        const updatedEntity: BudgetDTO = (
            await request(app.getHttpServer()).put('/api/budgets').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update budgets from id', async () => {
        const updatedEntity: BudgetDTO = (
            await request(app.getHttpServer())
                .put('/api/budgets/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE budgets', async () => {
        const deletedEntity: BudgetDTO = (
            await request(app.getHttpServer())
                .delete('/api/budgets/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
