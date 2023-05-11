import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { validate, required, isArray } from 'https://deno.land/x/validasaur@v0.15.0/mod.ts';

export const ParkingSpotValidation = async ({request, response}: RouterContext, next: Function) => {
  const body = await request.body().value;

  const [passes, errors] =  await validate(body, {
    parking_type_id: required,
    parking_entrance_distance: [required, isArray]
  });

  if (!passes) {
    response.status = 400;
    response.body = errors;
    return;
  }

  await next();
}
