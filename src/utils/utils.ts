
// export const formatToCamelCase = (
//   value: string | undefined,
//   options: { camelCase?: boolean; withSpace?: boolean } = { withSpace: true }
// ): string => {
//   if (!value || value === 'N/A') return 'N/A';

//   const words = value
//     .toLowerCase()
//     .split('_')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

//   if (options.camelCase && !options.withSpace) {
//     return words.join('');
//   }

//   return words.join(' ');
// };


export const formatToCamelCase = (
  value: unknown,
  options: { camelCase?: boolean; withSpace?: boolean } = { withSpace: true }
): string => {
  // Handle undefined, null, N/A, empty array
  if (
    value === undefined ||
    value === null ||
    value === 'N/A' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return 'N/A';
  }

  // Convert arrays → comma-separated string
  if (Array.isArray(value)) {
    value = value.join(', ');
  }

  // If after all this, it's still not a string, return safely
  if (typeof value !== 'string') {
    return String(value ?? 'N/A'); // Convert numbers, booleans safely to string
  }

  const words = value
    .toLowerCase()
    .split('_')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''));

  if (options.camelCase && !options.withSpace) {
    return words.join('');
  }

  return words.join(' ');
};


export const formatDate = (date: Date | null) => {
  const newDate = date ? new Date(date).toISOString().slice(0, 10) : null;
  return newDate;
};