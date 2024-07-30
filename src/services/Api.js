import { enviroment } from "../../config";

const ApiFetch = async (enpoint, method, body) => {

    const apiUrl = enviroment.api_url;

    const response = await fetch(`${apiUrl}${enpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    return response.json();
};

export {
    ApiFetch
}
