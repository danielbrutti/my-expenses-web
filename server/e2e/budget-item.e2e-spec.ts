import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { BudgetItemDTO } from '../src/service/dto/budget-item.dto';
import { BudgetItemService } from '../src/service/budget-item.service';

describe('BudgetItem Controller', () => {
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
            .overrideProvider(BudgetItemService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all budget-items ', async () => {
        const getEntities: BudgetItemDTO[] = (await request(app.getHttpServer()).get('/api/budget-items').expect(200))
            .body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET budget-items by id', async () => {
        const getEntity: BudgetItemDTO = (
            await request(app.getHttpServer())
                .get('/api/budget-items/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create budget-items', async () => {
        const createdEntity: BudgetItemDTO = (
            await request(app.getHttpServer()).post('/api/budget-items').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update budget-items', async () => {
        const updatedEntity: BudgetItemDTO = (
            await request(app.getHttpServer()).put('/api/budget-items').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update budget-items from id', async () => {
        const updatedEntity: BudgetItemDTO = (
            await request(app.getHttpServer())
                .put('/api/budget-items/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE budget-items', async () => {
        const deletedEntity: BudgetItemDTO = (
            await request(app.getHttpServer())
                .delete('/api/budget-items/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
