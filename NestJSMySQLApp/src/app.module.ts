import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { UserModule } from "./modules/user.module";
import { User } from "./entities/user.entity";
import { ProductModule } from "./modules/product.module";
import { Product } from "./entities/product.entity";
import { StudentModule } from "./modules/student.module";
import { Student } from "./entities/student.entity";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const entities = [User, Product, Student];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        url: config.get<string>('DB_CONNECTION_STRING'),
        entities,
        synchronize: true
      })
    }),
    WinstonModule.forRoot({
      level: "info",
      format: combine(label({ label: "right now!" }), timestamp(), myFormat),
      transports: [
        new transports.File({
          filename: "logs/debug.log",
          level: "debug",
        }),
      ],
    }),
        UserModule,
        ProductModule,
        StudentModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
