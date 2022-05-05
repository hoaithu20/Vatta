import { IsString } from 'class-validator';

export class DemoDto {
  @IsString()
  title: string;
}
