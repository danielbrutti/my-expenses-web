import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { CurrencyDTO } from '../src/service/dto/currency.dto';
import { CurrencyService } from '../src/service/currency.service';

describe('Currency Controller', () => {
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
            .overrideProvider(CurrencyService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all currencies ', async () => {
        const getEntities: CurrencyDTO[] = (await request(app.getHttpServer()).get('/api/currencies').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET currencies by id', async () => {
        const getEntity: CurrencyDTO = (
            await request(app.getHttpServer())
                .get('/api/currencies/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create currencies', async () => {
        const createdEntity: CurrencyDTO = (
            await request(app.getHttpServer()).post('/api/currencies').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update currencies', async () => {
        const updatedEntity: CurrencyDTO = (
            await request(app.getHttpServer()).put('/api/currencies').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update currencies from id', async () => {
        const updatedEntity: CurrencyDTO = (
            await request(app.getHttpServer())
                .put('/api/currencies/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE currencies', async () => {
        const deletedEntity: CurrencyDTO = (
            await request(app.getHttpServer())
                .delete('/api/currencies/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
