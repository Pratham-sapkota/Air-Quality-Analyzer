import { Injectable } from '@nestjs/common';
import { Aqi } from './schemas/aqi.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { getMonthNumber, parsingFile, rateAirQuality } from './utility/util';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Aqi_model')
    private aqiModel: Model<Aqi>,
  ) {}

  //function to upload file and store the data in database only if data is in proper format
  async uploadFile(filePath: string) {
    try {
      const response = await parsingFile(filePath);
      response.forEach(async (elements) => {
        const { aqi, day, month, year } = elements;
        //checks if data already exists in database , if not then inserts
        await this.aqiModel
          .findOneAndUpdate(
            { aqi, day, month, year },
            { $setOnInsert: { aqi, day, month, year } },
            { upsert: true },
          )
          .exec();
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  generateReport = async (month: string, year: any) => {
    try {
      const report = await this.aqiModel.aggregate([
        {
          $match: {
            month: month,
            year: year,
          },
        },
      ]);
      if (report.length > 0) {
        const max = Math.max(...report.map((data) => data.aqi));
        const min = Math.min(...report.map((data) => data.aqi));
        let sum = 0;
        report.forEach((data) => {
          const numAQI = parseInt(data.aqi);
          sum = sum + numAQI;
        });
        const avg = sum / report.length;
        const airQuality = rateAirQuality(avg);
        const list = report.map((data) => ({
          date: `${data.day}/${getMonthNumber(month)}/${data.year}`,
          aqi: parseInt(data.aqi),
        }));

        const finalReport = {
          month,
          year: parseInt(year),
          avg,
          category: airQuality,
          max,
          min,
          list,
        };

        return finalReport;
      } else {
        return 'No report found';
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
