import { EntityRepository } from "@mikro-orm/mysql";
import { Point } from "../entities/point.entity";

export class PointRepo extends EntityRepository<Point> {}
