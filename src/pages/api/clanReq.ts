const CLAN_ID = import.meta.env.API_CLANID;
const CLAN_ID2 = import.meta.env.API_CLANID2;
const CLAN_ID3 = import.meta.env.API_CLANID3;

const APPLICATION_ID = import.meta.env.API_APPLICATIONID;
const APPLICATION_ID2 = import.meta.env.API_APPLICATIONID2;

export interface ClanMember {
    role: string;
    joined_at: number;
    account_id: number;
    account_name: string;
}

export interface ClanData {
    members_count: number;
    name: string;
    creator_name: string;
    created_at: number;
    tag: string;
    updated_at: number;
    leader_name: string;
    members_ids: number[];
    creator_id: number;
    clan_id: number;
    members: Record<string, ClanMember>;
    old_name?: string;
    is_clan_disbanded: boolean;
    renamed_at?: number;
    old_tag?: string;
    leader_id: number;
    description: string;
}

export interface ApiResponse {
    status: string;
    meta: {
        count: number;
    };
    data: Record<string, ClanData>;
}

export async function fetchClanInfo(clanID : number): Promise<ClanData | null> {
    let clanIdToUse, appIdToUse;

    if (clanID === 1) {
        clanIdToUse = CLAN_ID;
        appIdToUse = APPLICATION_ID;
    } else if (clanID === 2) {
        clanIdToUse = CLAN_ID2;
        appIdToUse = APPLICATION_ID2;
    } else if (clanID === 3) {
        clanIdToUse = CLAN_ID3;
        appIdToUse = APPLICATION_ID2;
    } else {
        throw new Error('Invalid clan ID provided');
    }

    const url = `https://api.worldofwarships.asia/wows/clans/info/?application_id=${appIdToUse}&clan_id=${clanIdToUse}&language=en&extra=members`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ApiResponse = await response.json();
        console.log(data)
        return data.data[clanIdToUse];
    } catch (error) {
        console.error('Failed to fetch clan info:', error);
        return null;
    }
}
