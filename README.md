# issue-blog

> A util to turn github issue into a blog.

## Install

```
$ npm i -S issue-blog
```

```js
import IssueBlog from 'issue-blog';
```

Or umd builds are also available

```html
<script src="path/to/issue-blog.js"></script>
```

## Usage

```js
const issue = new IssueBlog({
    clientID: 'GitHub Application Client ID',
    clientSecret: 'GitHub Application Client Secret',
    repo: 'GitHub repo',
    owner: 'GitHub repo owner',
    cache: true,
    excerpt: 120,
    pageSize: 10,
    postLabel: 'post',
    pageLabel: 'page',
    loadFn: state => state,
});

issue
    .byPage({
        page: 1,
        labels: '',
        isPage: false,
    })
    .then(data => {
        console.log(data);
    });

issue.byId(1).then(data => {
    console.log(data);
});
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
