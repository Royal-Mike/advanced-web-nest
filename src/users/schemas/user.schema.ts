import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ default: () => Date.now() })
	userId: number;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

	@Prop({ default: () => new Date() })
	createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
