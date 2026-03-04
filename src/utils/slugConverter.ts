export const convertToSlug = (input: string): string => {
    return input
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z\s]/g, '') // Remove special characters and numbers
      .trim() // Remove leading/trailing spaces
      .split(/\s+/) // Split the string into words
      .join('-'); // Join words with hyphens
  }