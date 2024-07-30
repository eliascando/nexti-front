const enviroment = {
    api_url: import.meta.env.VITE_API_URL,
};

const keys = Object.keys(enviroment);
keys.forEach(key => {
    if(!enviroment[key] || enviroment[key] === ''){
        throw new Error(`${key} no definido`);
    }
});

export {
    enviroment
}