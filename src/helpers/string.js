const removeTrailingSlashTabOrNewLine = (str) => {
  return str.replace(/[\t\n\/]+$/, '');
};

const removeAccents = (str) => {
  return underscorify(
    str.normalize('NFD').trim().replace(/[\u0300-\u036f]/g, '')
  );
}

const underscorify = (str) => {
  return str.toLowerCase().replace(/\s+/g, '_');
}

export { removeTrailingSlashTabOrNewLine, removeAccents };