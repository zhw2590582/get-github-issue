# get-github-issue

> A util to get github issue

## Install

```
$ npm i -S get-github-issue
```

```js
import GetGithubIssue from 'get-github-issue';
```

Or umd builds are also available

```html
<script src="path/to/get-github-issue.js"></script>
```

## Usage

```js
const issue = new GetGithubIssue({
    clientID: '', // GitHub Application Client ID
    clientSecret: '', // GitHub Application Client Secret
    repo: '', // GitHub repo
    owner: '', // GitHub repo owner
    cache: true, // Whether to use the cache
    excerpt: 120, // Excerpt length
    pageSize: 10, // Length per page
    requestType: 'full', // Custom media types: raw | text | html | full
    loadFn: state => state, // Loading status
    labels: {
        post: 'POST', // Post label
        page: 'PAGE', // Post label
        config: 'CONFIG', // Config label
    },
});

// Get through pagination and tags
issue
    .byPage({
        page: 1, // Custom page number
        labels: 'code', // Custom labels
        type: 'POST', // Label type
    })
    .then(data => {
        console.log(data);
    });

// Get through ID
issue.byId(13).then(data => {
    console.log(data);
});
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
