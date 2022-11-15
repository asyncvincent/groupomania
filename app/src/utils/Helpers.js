export default class Helpers {
    /**
     * Format a date to a string in the format like: "01 Jan. 2000"
     * @param {Date} date
     * @returns {string}
     */
    static formatDate = (date) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(date).toLocaleDateString([], options);
    };

    /**
     * Use @formatDate to format a date to a string in the format like: "01 Jan. 2000" for the post date
     * @param {Date} date
     * @returns {string}
     */
    static timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (seconds > 86400) {
            return `${Helpers.formatDate(date)}`;
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return `${interval}h`;
        } else if (interval === 1) {
            return `${interval}h`;
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return `${interval}min`;
        } else if (interval === 1) {
            return `${interval}min`;
        }
        return `Moins d'une minute`;
    };

    /**
     * Make a avatar from a first letter of a username
     * @param {string} username
     * @returns {string}
     */
    static createAvatar = (username) => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f1f1f1";
        ctx.fillRect(0, 0, 100, 100);
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#9e9e9e";
        ctx.fillText(username[0].toUpperCase(), 50, 65);
        return canvas.toDataURL();
    };

    /**
     * Set a default page title
     * @returns {string}
     */
    static siteName = () => {
        return "Groupomania";
    };

    /**
     * Count the number of characters in a string
     * @param {number} number
     * @returns {string} 
     */
    static caracterCount = (number) => {
        if (number >= 300) {
            return `300/300`;
        } else {
            return `${number}/300`;
        }
    };
}
