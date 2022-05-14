import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { MoneyAccountDTO } from '../src/service/dto/money-account.dto';
import { MoneyAccountService } from '../src/service/money-account.service';

describe('MoneyAccount Controller', () => {
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
            .overrideProvider(MoneyAccountService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all money-accounts ', async () => {
        const getEntities: MoneyAccountDTO[] = (
            await request(app.getHttpServer()).get('/api/money-accounts').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET money-accounts by id', async () => {
        const getEntity: MoneyAccountDTO = (
            await request(app.getHttpServer())
                .get('/api/money-accounts/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create money-accounts', async () => {
        const createdEntity: MoneyAccountDTO = (
            await request(app.getHttpServer()).post('/api/money-accounts').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update money-accounts', async () => {
        const updatedEntity: MoneyAccountDTO = (
            await request(app.getHttpServer()).put('/api/money-accounts').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update money-accounts from id', async () => {
        const updatedEntity: MoneyAccountDTO = (
            await request(app.getHttpServer())
                .put('/api/money-accounts/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE money-accounts', async () => {
        const deletedEntity: MoneyAccountDTO = (
            await request(app.getHttpServer())
                .delete('/api/money-accounts/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
