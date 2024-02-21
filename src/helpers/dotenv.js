const env = (key, defaultValue) => {
    const value = process.env[key];
    return value ? value : defaultValue;
}

export { env }