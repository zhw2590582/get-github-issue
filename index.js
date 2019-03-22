function queryStringify(query) {
    return Object.keys(query)
        .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
        .join('&');
}

function truncateString(str, num) {
    return str.length > num ? `${str.slice(0, num > 3 ? num - 3 : num)}...` : str;
}

class GetGithubIssue {
    constructor(option = {}) {
        this.cache = new Map();
        this.option = Object.assign({}, GetGithubIssue.DEFAULTS, option);
        ['owner', 'repo', 'clientID', 'clientSecret'].forEach(key => {
            if (!this.option[key]) {
                throw new TypeError(`[option.${key}] can not be empty.`);
            }
        });
    }

    static get DEFAULTS() {
        return {
            owner: '',
            repo: '',
            clientID: '',
            clientSecret: '',
            cache: true,
            excerpt: 120,
            pageSize: 10,
            requestType: 'full',
            loadFn: state => state,
            labels: {
                post: 'POST',
                page: 'PAGE',
                config: 'CONFIG',
            },
        };
    }

    getUrl(option) {
        const api = `https://api.github.com/repos/${this.option.owner}/${this.option.repo}/issues`;
        const query = {
            t: Date.now(),
            client_id: this.option.clientID,
            client_secret: this.option.clientSecret,
        };

        if (typeof option === 'number') {
            return `${api}/${option}?${queryStringify(query)}`;
        }

        return `${api}?${queryStringify(Object.assign(query, option))}`;
    }

    getRequest(url) {
        this.option.loadFn(true);
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Accept: `application/vnd.github.v3.${this.option.requestType}+json`,
            },
        })
            .then(res => {
                this.option.loadFn(false);
                if (res.status === 404) {
                    return Promise.reject(new Error('Unauthorized'));
                }
                return res.json();
            })
            .catch(err => {
                this.option.loadFn(false);
                throw err;
            });
    }

    format(issue) {
        const post = {
            title: issue.title,
            html: issue.body_html,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            comments: issue.comments,
            tags: issue.labels
                .filter(tag => !Object.values(this.option.labels).includes(tag.name))
                .map(tag => tag.name),
            url: issue.url,
            id: issue.number,
            excerpt: '',
            poster: '',
        };

        try {
            post.excerpt = truncateString(issue.body_text.replace(/[\r\n]/g, ''), this.option.excerpt);
        } catch (error) {
            post.excerpt = '';
        }

        try {
            // eslint-disable-next-line
            post.poster = /src=[\'\"]?([^\'\"]*)[\'\"]?/i.exec(/<img.*?(?:>|\/>)/.exec(issue.body_html)[0])[1];
        } catch (error) {
            post.poster = '';
        }

        return post;
    }

    byPage({ page = 1, labels = '', type = this.option.labels.post }) {
        const key = `page=${page}&labels=${labels}&type=${type}`;
        if (this.option.cache && this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key));
        }

        const buildInLabels = Object.values(this.option.labels);
        if (!buildInLabels.includes(type)) {
            throw new TypeError(`[type] only accept: ${buildInLabels.join('|')}.`);
        }

        const url = this.getUrl({
            page,
            per_page: this.option.pageSize,
            labels: `${type},${labels}`,
        });

        return this.getRequest(url).then(data => {
            const result = data.map(item => {
                if (this.option.cache) {
                    this.cache.set(`id=${item.number}`, item);
                }
                return this.format(item);
            });
            if (this.option.cache) {
                this.cache.set(key, result);
            }
            return result;
        });
    }

    byId(id) {
        const key = `id=${id}`;
        if (this.option.cache && this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key));
        }

        const url = this.getUrl(Number(id));

        return this.getRequest(url).then(data => {
            const result = this.format(data);
            if (this.option.cache) {
                this.cache.set(key, result);
            }
            return result;
        });
    }
}

window.GetGithubIssue = GetGithubIssue;
export default GetGithubIssue;
