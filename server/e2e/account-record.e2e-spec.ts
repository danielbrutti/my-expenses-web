import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AccountRecordDTO } from '../src/service/dto/account-record.dto';
import { AccountRecordService } from '../src/service/account-record.service';

describe('AccountRecord Controller', () => {
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
            .overrideProvider(AccountRecordService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all account-records ', async () => {
        const getEntities: AccountRecordDTO[] = (
            await request(app.getHttpServer()).get('/api/account-records').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET account-records by id', async () => {
        const getEntity: AccountRecordDTO = (
            await request(app.getHttpServer())
                .get('/api/account-records/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create account-records', async () => {
        const createdEntity: AccountRecordDTO = (
            await request(app.getHttpServer()).post('/api/account-records').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update account-records', async () => {
        const updatedEntity: AccountRecordDTO = (
            await request(app.getHttpServer()).put('/api/account-records').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update account-records from id', async () => {
        const updatedEntity: AccountRecordDTO = (
            await request(app.getHttpServer())
                .put('/api/account-records/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE account-records', async () => {
        const deletedEntity: AccountRecordDTO = (
            await request(app.getHttpServer())
                .delete('/api/account-records/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
