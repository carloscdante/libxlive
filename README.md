# Xbox Live Info

Library for Xbox Live account interaction. Manipulate and fetch data from Xbox Live accounts with easy to use utility functions!

## Authentication

Authentication for this module is provided by the [@xboxreplay/xboxlive-auth](https://github.com/XboxReplay/xboxlive-auth/) library. Kudos to Xboxreplay, the lib makes it really easy to authenticate users with no issues whatsoever.

------------------------------
### Authenticate via username and password

```typescript

import { logOn } from "libxlive"

logOn({
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD"
}, data => {
    console.log(data); // You are now logged in!
});

```

### Authenticate via refresh token

```typescript

import { loginWithRefreshToken } from "libxlive"

loginWithRefreshToken("YOUR_REFRESH_TOKEN", data => {
    console.log(data); // You are now logged in!
});

```

I could explain how you can get a refresh token yourself, but the [xboxlive-auth](https://github.com/XboxReplay/xboxlive-auth/blob/master/docs/01-Authenticate.md) repo does a much better job at it that I could ever do. Check it out!

## Using account data

Now that you've logged in, you can do a lot of fun stuff with your Xbox Live data.

### Fetching User Achievements

#### getAllAchievements(params: XUIDLoginRequestReturn)


```typescript

import { logOn, getAllAchievements } from "libxlive"

logOn({
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD"
}, data => {
    console.log(getAllAchievements(data)); // All user achievements
});

```

This function gets all achievements from an Xbox Live account.

But there is a problem! This whole function is inefficient because it fetches all user achievements with no regards to pagination whatsoever. If the user has 10000 achievements it will fetch all of them. That's why we have another function that paginates everything.

#### getAchievementPage(params: XUIDLoginRequestReturn, pageToken?: number)

```typescript

import { logOn, getAchievementPage } from "libxlive"

logOn({
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD"
}, data => {
    console.log(getAchievementPage(data)); // Fist page of user achievements
});

```

This function, as called on the example, fetches only the first page of the user's achievements. Usually that means the first 36 (Microsoft could just change it).

It returns the achievement page, alongside with a continuation token. you pass the continuation token as the second parameter in the function. For the first page, there is no need for this token!