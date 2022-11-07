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

type AchievementReturn = {
    id: string;
    serviceConfigId: string;
    name: string;
    titleAssociations: object[];
    progressState: string;
    progression: object;
    mediaAssets: object;
    platforms: string[];
    isSecret: boolean;
    description: string;
    lockedDescription: string;
    productId: string;
    achievementType: string;
    participationType: string;
    timeWindow: unknown;
    rewards: object[];
    estimatedTime: string;
    deeplink: string;
    isRevoked: boolean;
}

type Handler = ((t: any) => {})