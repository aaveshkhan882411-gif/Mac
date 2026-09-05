class MacAuthManager {
    constructor() {
        this.authorizedUsers = ["Aavesh"]; // अधिकृत यूज़र्स की लिस्ट
        this.tokenRegistry = new Map();
    }

    verifyUser(username) {
        if (this.authorizedUsers.includes(username)) {
            const token = "MAC-AUTH-" + Math.random().toString(36.substring(2, 15));
            this.tokenRegistry.set(username, token);
            console.log(`[AUTH]: User '${username}' authenticated successfully.`);
            return { status: "success", token: token };
        } else {
            console.log(`[AUTH WARNING]: Unauthorized access attempt by '${username}'.`);
            return { status: "unauthorized", token: null };
        }
    }

    validateToken(username, token) {
        return this.tokenRegistry.has(username) && this.tokenRegistry.get(username) === token;
    }
}

module.exports = MacAuthManager;
