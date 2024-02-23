import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { UserModule } from '../src/modules/user/user.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { StorageModule } from '../src/modules/storage/storage.module';
import { AuthDto } from '../src/modules/auth/dto';
import passport from 'passport';
import { drop } from 'lodash';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UserModule, AuthModule, StorageModule], // Ensure all required modules are imported
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleandb();
    // for no repeate URL
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@example.com',
      password: 'rokaya123',
    };
    describe('Signup', () => {
      it('Should throw throw if email is not empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ passport: dto.password })
          .expectStatus(400);
      });
      it('Should throw throw if password is not empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect()
      });
    });
    describe('Signin', () => {
      it('Should throw throw if email is not empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ passport: dto.password })
          .expectStatus(400);
      });
      it('Should throw throw if password is not empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt','access_token') //to save a the access token 
        // .inspect()
      });

    });
  });
  describe('User', () => {
    describe('Get me',()=>{
      it('should get current user ', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .expectStatus(200)
          // .inspect()

      });
    })

  })

});
