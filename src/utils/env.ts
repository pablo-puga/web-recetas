const getEnvVar = (name: string) => {
    return process.env?.[name] ?? undefined;
};

const getIntEnvVar = (name: string, defaultValue = 0) => {
    const envVar = getEnvVar(name);
    if (envVar === undefined) return defaultValue;

    const variable = parseInt(envVar, 10);
    return isNaN(variable) ? defaultValue : variable;
};

const getStringEnvVar = (name: string, defaultValue = '') => {
    const envVar = getEnvVar(name);
    return envVar === undefined ? defaultValue : envVar;
};

export { getIntEnvVar, getStringEnvVar };
