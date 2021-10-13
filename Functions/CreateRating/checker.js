const axios = require('axios')

module.exports = {
    checkUser: async (userId) => {
        try {
            await axios.get(`https://serverlessohapi.azurewebsites.net/api/GetUser?userId=${userId}`);
            return true;
        } catch (e) {
            return false;
        }
    },
    checkProduct: async (productId) => {
        try {
            await axios.get(`https://serverlessohapi.azurewebsites.net/api/GetProduct?productId=${productId}`);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}