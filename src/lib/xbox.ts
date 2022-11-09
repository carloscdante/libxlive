import axios from 'axios';
import { authenticate, authenticateWithUserRefreshToken } from '@xboxreplay/xboxlive-auth';
import qs from 'qs';









/**
 * getToken()
 * getToken uses the xboxlive-auth lib from xboxreplay to authenticate the user with their email and password.
 * 
 * @param params | The function parameters, those should be typed as specified.
 * @param callback | callback function, I couldn't find a way to use xboxlive-auth with async-await.
 */

export const logOn = async (params: UserLoginInitialization, callback: Handler): Promise<void> => {
    authenticate(params.username, params.password)
	.then(data => {
        callback(data); // Authenticated user object
    })
	.catch((e) => {
        throw e;
    });
}










/**
 * loginWithRefreshToken()
 * This function uses the xboxlive-auth lib from xboxreplay to log in a user via refresh token.
 * 
 * @param refreshToken | User's refresh token. Get it by navigating to
 * https://login.live.com and getting the refresh token through the request.
 * @param callback | callback function, I couldn't find a way to use xboxlive-auth with async-await.
 */
export const loginWithRefreshToken = async (refreshToken: string, callback: Handler): Promise<void> => {
    authenticateWithUserRefreshToken(refreshToken)
	.then(data => {
        callback(data); // Authenticated user object
    })
	.catch((e) => {
        throw e;
    });
}















// achievements
/**
 * getAllAchievements()
 * This function gets all achievements from an Xbox Live account.
 * 
 * 
 * BEWARE this function is inefficient because
 * it fetches all user achievements with no regards to pagination whatsoever.
 * If the user has 10000 achievements it will fetch all of them.
 * 
 * 
 * @param params | The function parameters, those should be typed as specified.
 * @returns an array of achievements from an Xbox Live account.
 */
export const getAllAchievements = async (params: XUIDLoginRequestReturn): Promise<AchievementReturn[]> => {
    let achievements = [];
    let continuationToken = undefined;

    const { data } = await axios.get(
        `https://achievements.xboxlive.com/users/xuid(${params.xuid})/achievements`, {
        headers: {
            Authorization: `XBL3.0 x=${params.user_hash};${params.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })

    achievements = [...data.achievements]

    continuationToken = data.pagingInfo.continuationToken

    for (let i = 0; i < Math.floor(parseInt(data.pagingInfo.totalRecords)/parseInt(data.achievements.length)); i++) {
        const newAchievements = await (await axios.get(
            `https://achievements.xboxlive.com/users/xuid(${params.xuid})/achievements`, {
            params: {
                continuationToken: continuationToken
            },
            headers: {
                Authorization: `XBL3.0 x=${params.user_hash};${params.xsts_token}`,
                "x-xbl-contract-version": 2,
            }
        })).data;
        achievements = [...achievements, ...newAchievements.achievements];
        continuationToken = newAchievements.pagingInfo.continuationToken
    }

    return achievements;
}










/**
 * getAchievementPage()
 * This function gets an array of achievements from an Xbox Live account (with pagination).
 * It fetches a specific page from the API.
 * 
 * @param params | The function parameters, those should be typed as specified.
 * @param pageToken | The continuationToken to fetch a specific page. If there is no pageToken, it fetches the first page.
 * @returns an array of achievements from an Xbox Live account.
 */
export const getAchievementPage = async (params: XUIDLoginRequestReturn, pageToken?: number): Promise<AchievementReturn[]> => {
    let achievements = [];

    const { data } = pageToken ? await axios.get(
        `https://achievements.xboxlive.com/users/xuid(${params.xuid})/achievements`, {
        params: {
            continuationToken: pageToken,
        },
        headers: {
            Authorization: `XBL3.0 x=${params.user_hash};${params.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    }) : await axios.get(
        `https://achievements.xboxlive.com/users/xuid(${params.xuid})/achievements`, {
        headers: {
            Authorization: `XBL3.0 x=${params.user_hash};${params.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })

    achievements = [...data.achievements]
    
    return achievements;
}








/**
 * getAchievementInfo()
 * Gets an achievement object by its ID. There is also the need to specify the serviceConfigId because Microsoft.
 * 
 * @param userData | The user's authentication data.
 * @param achievementId | The achievement's id.
 * @param serviceConfigId | The service config id of the achievement.
 * @returns Achievement data
 */
export const getAchievementInfo = async (userData: XUIDLoginRequestReturn, achievementId: string, serviceConfigId: string): Promise<AchievementReturn> => {

    const query: AchievementQuery = {
        serviceConfigId: serviceConfigId,
        achievementId: achievementId,
    }

    return await (await (axios.get(
        `https://achievements.xboxlive.com/users/xuid(${userData.xuid})/achievements/${query.serviceConfigId}/${query.achievementId}`, {
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    }))).data as AchievementReturn;
}


















/**
 * Gets the message inbox from the authenticated user
 * 
 * @param userData The user's authentication data.
 * @param maxItems The maximum number of messages to retrieve from the query.
 * @returns An array of messages.
 */
export const getMessageInbox = async (userData: XUIDLoginRequestReturn, maxItems: number) => {
    try {
        const messages = await axios.get(`msg.xboxlive.com/users/xuid(${userData.xuid})/inbox`, {
            params: qs.stringify({
            maxItems: maxItems,
        }), headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }})
        .catch(e => {
            console.log(e.status);
            throw e.response.body
        });
        return messages;
    } catch (e) {
        throw e.response;
    }
}















/**
 * Gets a single message through its ID.
 * 
 * @param userData The user's authentication data.
 * @param messageId The message's id.
 * @returns A message object.
 */
export const getSingleMessage = async (userData: XUIDLoginRequestReturn, messageId: string) => {
    try {
        const messages = await axios.get(`msg.xboxlive.com/users/xuid(${userData.xuid})/inbox/${messageId}`, {
            headers: {
                Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
                "x-xbl-contract-version": 2,
            }
        })
        .catch(e => {
            console.log(e.status);
            throw e.response.body
        });
        return messages;
    } catch (e) {
        throw e.response;
    }
}















/**
 * Deletes a single message from a user's inbox.
 * 
 * @param userData The user's authentication data.
 * @param messageId The message's id.
 * @returns The deleted message object.
 */
export const deleteSingleMessage = async (userData: XUIDLoginRequestReturn, messageId: string) => {
    try {
        const message = await axios.delete(`msg.xboxlive.com/users/xuid(${userData.xuid})/inbox/${messageId}`, {
            headers: {
                Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
                "x-xbl-contract-version": 2,
            }
        })
        .catch(e => {
            console.log(e.status);
            throw e.response.body
        });
        return message;
    } catch (e) {
        throw e.response;
    }
}











/**
 * Sends a message to a user's inbox and places it on the authenticated user's outbox.
 * 
 * @param userData The user's authentication data
 * @param message The message data to be sent
 * @returns the message send request
 */
export const sendMessage = async (userData: XUIDLoginRequestReturn, message: MessageSendData) => {
    const messageRequest = await axios.post(`msg.xboxlive.com/users/xuid(${userData.xuid})/outbox`, {
        body: {
            header: message.title,
            messageText: message.text
        },
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
            "recipients": message.recipients,
        }
    })
    .catch(e => {
        console.log(e.status);
        throw e.response.body
    });

    return messageRequest;
}




















/**
 * Gets the authenticated user's friend list.
 * 
 * @param userData The user's authentication data
 * @returns a Person array
 */
export const getFriends = async (userData: XUIDLoginRequestReturn) => {
    return (await axios.get(`social.xboxlive.com/users/xuid(${userData.xuid})/people`, {
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })).data as Person[];
}













/**
 * Gets the authenticated user's friend list, returning their XUIDs.
 * 
 * @param userData The user's authentication data
 * @returns a Person array
 */
export const getFriendsXUID = async (userData: XUIDLoginRequestReturn) => {
    return (await axios.get(`social.xboxlive.com/users/xuid(${userData.xuid})/people/xuids`, {
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })).data as Person[];
}











/**
 * Gets a specific friend from the authenticated user via their XUID.
 * 
 * @param userData The user's authentication data
 * @param xuid The friend's XUID.
 * @returns 
 */
export const getFriendByXUID = async (userData: XUIDLoginRequestReturn, xuid: string) => {
    return (await axios.get(`social.xboxlive.com/users/xuid(${userData.xuid})/people/xuid(${xuid})`, {
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })).data as Person;
}















/**
 * Gets a friend summary from a specific user.
 * 
 * @param userData The user's authentication data
 * @returns a PersonSummary
 */
export const getFriendSummary = async (userData: XUIDLoginRequestReturn) => {
    return (await axios.get(`social.xboxlive.com/users/xuid(${userData.xuid})/summary`, {
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })).data as PersonSummary;
}
















/**
 * Gets statistics for a batch of titles and users.
 * 
 * @param userData The user's authentication data
 * @param stats The request object for stats retrieval
 * @returns 
 */
export const getBatchStatistics = async (userData: XUIDLoginRequestReturn, stats: StatisticsRequest) => {
    return (await axios.post(`userstats.xboxlive.com/batch`, {
        body: stats,
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })).data as TitleStatsReturnUser[];
}


















/**
 * Gets the authenticated user's statistics for a single title
 * 
 * @param userData The user's authentication data
 * @param statArray The array of statistic names, e. g. headshots, kills, wins, etc.
 * @param titleId The title's SCID (service config id)
 * @returns A TitleStatsReturnUser object
 */
export const getTitleStatistics = async (userData: XUIDLoginRequestReturn, statArray: string[], titleId: string) => {
    return (await axios.post(`userstats.xboxlive.com/users/xuid(${userData.xuid})/scids/${titleId}/stats/${statArray.join(',')}`, {
        headers: {
            Authorization: `XBL3.0 x=${userData.user_hash};${userData.xsts_token}`,
            "x-xbl-contract-version": 2,
        }
    })).data as TitleStatsReturnUser;
}