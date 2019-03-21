class IssueBlog {
    constructor(option) {
        this.cache = {};
        this.option = option;
        console.log(option);
    }

    static get version() {
        return '__VERSION__';
    }

    static get env() {
        return '__ENV__';
    }
}

window.IssueBlog = IssueBlog;
export default IssueBlog;