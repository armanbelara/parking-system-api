import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

export const formatDateTime = (datetime: string) => {
  
  let datetimeString = datetime;
  if (!moment(datetime, moment.ISO_8601).isValid()) {
    datetimeString = datetime.substring(0, 33);
    datetimeString.split(' ');
  }

  const date = new Date(datetimeString);

  return moment(date).format();
}