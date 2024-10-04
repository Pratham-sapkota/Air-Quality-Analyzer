import { Months } from '../validation/enum';
import * as fs from 'fs';
import * as parse from 'csv-parser';

export const getMonthNumber = (month) => {
  const months = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };
  return months[month];
};

export const isValidData = (data: any): boolean => {
  const { aqi, day, month, year } = data;
  const correctMonths = [
    Months.January,
    Months.February,
    Months.March,
    Months.April,
    Months.May,
    Months.June,
    Months.July,
    Months.August,
    Months.September,
    Months.October,
    Months.November,
    Months.December,
  ];
  if (aqi < 0 || aqi > 400) return false;
  if (day < 1 || day > 31) return false;
  if (!correctMonths.includes(month.toLowerCase())) return false;
  if (year.length !== 4) return false;
  return true;
};

export const parsingFile = (filePath: string): Promise<any[]> => {
  const result: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ separator: ',' }))
      .on('data', (data) => {
        if (Object.keys(data).length > 0) {
          if (isValidData(data)) {
            result.push(data);
          }
        }
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', () => {
        reject(new Error(Error.name));
      });
  });
};

export const rateAirQuality = (avg: number) => {
  if (avg >= 0 && avg <= 50) {
  } else if (avg >= 0 && avg <= 50) {
    return 'Good';
  } else if (avg >= 51 && avg <= 100) {
    return 'Moderate';
  } else if (avg >= 101 && avg <= 150) {
    return 'Unhealthy for sensitive groups';
  } else if (avg >= 151 && avg <= 200) {
    return 'Unhealthy';
  } else if (avg >= 201 && avg <= 300) {
    return 'Very unhealthy';
  } else {
    return 'Hazardous';
  }
};
