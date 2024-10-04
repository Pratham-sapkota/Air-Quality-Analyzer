import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AQIDocument = HydratedDocument<Aqi>;

@Schema()
export class Aqi {
  @Prop()
  aqi: string;

  @Prop()
  day: string;

  @Prop()
  month: string;

  @Prop()
  year: string;
}

export const AqiSchema = SchemaFactory.createForClass(Aqi);
