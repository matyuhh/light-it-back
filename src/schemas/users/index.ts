import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DiagnosisDocument = Diagnosis & Document;

class DiagnosisIssue {
  @Prop({ required: true })
  ID: number;
  @Prop({ required: true })
  Name: string;
  @Prop({ required: true })
  Accuracy: number;
  @Prop({ required: true })
  Icd: string;
  @Prop({ required: true })
  IcdName: string;
  @Prop({ required: true })
  ProfName: string;
  @Prop({ required: true })
  Ranking: number;
}

class DiagnosisItem {
  @Prop({ required: true })
  Issue: DiagnosisIssue;
  @Prop({ required: false })
  Specialisation?: string;
}

@Schema({ timestamps: true })
export class Diagnosis {
  @Prop({ required: true })
  diagnosisItems: DiagnosisItem[];
  @Prop({ required: false })
  isValid: boolean;

  @Prop() createdAt?: Date;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
export interface DiagnosisInterface {
  diagnosisItems: DiagnosisItem[];
  isValid: boolean;
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  gender: string;
  @Prop({ required: true })
  year_of_birth: number;
  @Prop({ required: true })
  hash: string;

  @Prop({ type: [DiagnosisSchema], default: [], required: false })
  diagnosis: DiagnosisInterface[];

  @Prop() createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
