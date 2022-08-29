import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as HmacMD5 from 'crypto-js/hmac-md5';
import * as Base64 from 'crypto-js/enc-base64';
import axios from 'axios';
import { UserModel } from 'src/schemas/users';

@Injectable()
export class HealthService {
  constructor(private configService: ConfigService) {}
  private API_MEDIC_USERNAME =
    this.configService.get<string>('api_medic_username');
  private API_MEDIC_PASSWORD =
    this.configService.get<string>('api_medic_password');

  private getTokenData = async () => {
    const url = 'https://sandbox-authservice.priaid.ch/login';
    const computedHash = HmacMD5(url, this.API_MEDIC_PASSWORD).toString(Base64);

    const tokenData = await axios({
      method: 'POST',
      url,
      data: {},
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.API_MEDIC_USERNAME}:${computedHash} `,
      },
    })
      .then(({ data }) => data)
      .catch((err) => console.error(err));

    return tokenData;
  };

  public getSymptomsList = async () => {
    const tokenData = await this.getTokenData();

    const symptoms = await axios({
      method: 'GET',
      url: `https://sandbox-healthservice.priaid.ch/symptoms`,
      params: {
        token: tokenData.Token,
        language: 'en-gb',
      },
      data: {},
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(({ data }) => data)
      .catch((err) => console.error(err));

    return symptoms;
  };

  public getDiagnosisListFromSymptoms = async (data) => {
    const tokenData = await this.getTokenData();
    const { symptoms, userId } = data;
    const diagnosisList = await axios({
      method: 'GET',
      url: `https://sandbox-healthservice.priaid.ch/diagnosis`,
      params: {
        token: tokenData.Token,
        language: 'en-gb',
        symptoms: JSON.stringify(symptoms.symptoms),
        gender: symptoms.gender,
        year_of_birth: symptoms.year_of_birth,
      },
      data: {},
      timeout: 8000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(({ data }) => data)
      .catch((err) => console.error(err.message));

    await UserModel.updateOne(
      { _id: userId },
      { $push: { diagnosis: { diagnosisItems: diagnosisList } } },
      { new: true },
    );

    return diagnosisList;
  };

  public getDiagnosisHistory = async (userId) => {
    const diagnosis = await UserModel.findOne(
      { _id: userId },
      'diagnosis',
    ).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
    return diagnosis;
  };

  public setDiagnosisValidity = async ({ data, id }) => {
    const diagnosis = await UserModel.findOneAndUpdate(
      {
        diagnosis: { $elemMatch: { _id: id } },
      },
      {
        $set: { 'diagnosis.$.isValid': data.isValid },
      },
      { new: true },
    );
    return diagnosis;
  };
}
