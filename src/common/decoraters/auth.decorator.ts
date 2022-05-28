import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

export function Authentication(){
  return UseGuards(JwtAuthGuard)
} 