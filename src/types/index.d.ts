type UserLoginInitialization = {
    username: string;
    password: string;
}

type XUIDLoginRequestReturn = {
    xuid: string;
    user_hash: string;
    xsts_token: string;
    display_claims: object;
    expires_on: string;
}