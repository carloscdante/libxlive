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
    /** User's XUID (Xbox Live ID)*/
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

interface PagingInfo {
    continuationToken: string;
    totalItems: number;
}

/**
 * Message
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Message {}

interface MessageSendData {
    title: string;
    text: string;
    /**
     * recipients (xuid/gamertag array)
     */
    recipients: string[];
}
/**
 * User
 */

interface User {
    gamertag: string;
    rank: number;
    rating: string;
    xuid: string;
}

interface UserClaims {
    xuid: string;
    gamertag: string;
}

interface UserTitle {
    lastUnlock: string;
    titleId: string;
    titleVersion: string;
    serviceConfigId: string;
    titleType: string;
    platform: string;
    name: string;
    earnedAchievements: string;
    currentGamerscore: string;
    maxGamerscore: string;
}

/**
 * MessageReturn
 */

interface MessageReturnData {
    results: Message[];
    pagingInfo: PagingInfo;
}


interface Person {
    xuid: string;
    isFavorite: boolean;
    isFollowingCaller: boolean;
    socialNetworks: string[];
}

interface PersonSummary {
    targetFollowingCount: number;
    targetFollowerCount: number;
    isCallerFollowingTarget: boolean;
    isTargetFollowingCaller: boolean;
    hasCallerMarkedTargetAsFavorite: boolean;
    hasCallerMarkedTargetAsKnown: boolean;
    legacyFriendStatus: string;
    recentChangeCount: number;
    watermark: string;
}

/**
 * Handler
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type Handler = ((t: unknown) => {})