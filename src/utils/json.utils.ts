export const handleBeautifyJson = (json: string | undefined): string => JSON.stringify(JSON.parse(json || '{}'), undefined, 4);
export const handleMinifyJson = (json: string | undefined): string => JSON.stringify(JSON.parse(json || '{}'), null, 0);
// export const handleIsValidJson = (json: string | undefined): boolean => {
//   if (json === undefined) return false;
//   else {
//     try {
//       JSON.parse(json);
//     } catch (e) {
//       console.error('JSON parsing error:', e);
//       return false;
//     }
//     return true;
//   }
// };
export const handleIsValidJson = (json: string | undefined): boolean => {
  if (json === undefined) return false;

  try {
    JSON.parse(json);
  } catch (e) {
    console.error('JSON parsing error:', e);
    return false;
  }
  return true;
};
