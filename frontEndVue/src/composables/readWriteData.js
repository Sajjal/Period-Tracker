const SERVER = process.env.API;

const readWriteData = () => {

    async function authorize() {
        return await fetch(`${SERVER}authorize`, {
            method: "GET",
            headers: { "content-type": "application/json" },
        });
    }

    async function login(data) {
        let response = await fetch(`${SERVER}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data),
        });
        return await response.json();
    }

    async function logout() {
        let response = await fetch(`${SERVER}logout`, {
            method: "POST",
            headers: { "content-type": "application/json" },
        });
    }

    async function getData() {
        let response = await fetch(`${SERVER}dashboard`, {
            method: "POST",
            headers: { "content-type": "application/json" },
        });
        response = await response.json();
        return response.data
    }

    async function addData(data) {
        await fetch(`${SERVER}dashboard/add`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data),
        });
    }
    return { authorize, login, logout, getData, addData }
}

export default readWriteData;