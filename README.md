
## Claim

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)



## API Reference

#### Authorization

```http
  POST /authenticate/
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | Username  |
| `password` | `string` | User password  |

Returns a token for user rest api calls (the token is valid for 12 hours)

#### Get item

```http
  GET /api/v1/task/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |



## License


[APACHE-2.0 license](https://www.apache.org/licenses/LICENSE-2.0)


## Authors



- [@Chswell](https://github.com/Chswell)
- [@Danil-Prog](https://github.com/Danil-Prog)

