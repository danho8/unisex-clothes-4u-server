import { plainToInstance } from 'class-transformer';

export const toSlug = (str: string) => {
  str = str.trim().replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str
    .replace(/  +/g, '-')
    .replace(/ /g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
};

export function ToBoolean(value: any): boolean | any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

export function generateNumber(name: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const second = date.getSeconds();

  return `${name}${year}${month}${day}${hour}${minutes}${second}`;
}

export const responseJSON = async (
  data?: any,
  outputDto?: any,
): Promise<any> => {
  if (data) {
    if (outputDto) {
      return plainToInstance(outputDto, data, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }
    return data;
  }
};
