export const truncateDescription = (description, limit) => {
  if (description.length > limit) {
    return description.substring(0, limit) + "...";
  }
  return description;
};
