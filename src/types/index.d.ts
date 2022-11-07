/**
 * UserLoginInitialization
 */

interface UserLoginInitialization {
    username: string;
    password: string;
}

/**
 * XUIDLoginRequestReturn
 */
interface XUIDLoginRequestReturn {
    /** User's XUID (Xbox Live ID) */
    xuid: string;
    /** User hash */
    user_hash: string;
    /** XSTS token for auth */
    xsts_token: string;
    /** User claims */
    display_claims: object;
    /** Token expiry date */
    expires_on: string;
}

/**
 * AchievementReturn
 */
interface AchievementReturn {
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

/**
 * AchievementQuery
 */
interface AchievementQuery {
    serviceConfigId: string;
    achievementId: string;
}

/**
 * Handler
 */
type Handler = ((t: any) => {})