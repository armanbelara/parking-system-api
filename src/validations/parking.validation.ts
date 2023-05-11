import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { validate, required, isDate } from 'https://deno.land/x/validasaur@v0.15.0/mod.ts';

export const ParkingValidation = async ({request, response}: RouterContext, next: Function) => {
  const body = await request.body().value;

  const [passes, errors] =  await validate(body, {
    transact_datetime: [required, isDate],
    parking_entrance_id: required
  });

  if (!passes) {
    response.status = 400;
    response.body = errors;
    return;
  }

  await next();
}

export const UnparkingValidation = async ({request, response}: RouterContext, next: Function) => {
  const body = await request.body().value;

  const [passes, errors] =  await validate(body, {
    plate_number: required,
    parking_entrance_id: required,
    transact_datetime: [required, isDate]
  });

  if (!passes) {
    response.status = 400;
    response.body = errors;
    return;
  }

  await next();
}


export const ParkingFeeValidation = async ({request, response}: RouterContext, next: Function) => {
  const body = await request.body().value;

  const [passes, errors] =  await validate(body, {
    transact_datetime: [required, isDate],
    plate_number: required
  });

  if (!passes) {
    response.status = 400;
    response.body = errors;
    return;
  }

  await next();
}