import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { validate, required } from 'https://deno.land/x/validasaur@v0.15.0/mod.ts';

export const VehicleValidation = async ({request, response}: RouterContext, next: Function) => {
  const body = await request.body().value;

  const [passes, errors] =  await validate(body, {
    plate_number: required,
    vehicle_type_id: required
  });

  if (!passes) {
    response.status = 400;
    response.body = errors;
    return;
  }

  await next();
}
