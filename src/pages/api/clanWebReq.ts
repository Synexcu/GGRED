const CLAN_ID = import.meta.env.API_CLANID;
const CLAN_ID2 = import.meta.env.API_CLANID2;
const CLAN_ID3 = import.meta.env.API_CLANID3; //YOR

export interface Achievement {
    count: number;
    cd: number;
}

export interface ClanStats {
    pvp: number;
    cvc: number;
}

export interface RecruitingRestrictions {
    win_rate: number;
    battles_count: number;
}

export interface CommunityUrls {
    discord: string;
}

export interface ClanBaseClan {
    personal_resource: number;
    members_count: number;
    active_invites: any[];
    id: number;
    raw_description: string;
    is_application_sent: boolean;
    is_invite_received: boolean;
    pre_moderation: any[];
    stats: ClanStats;
    leveling: number;
    accumulative_resource: number;
    max_members_count: number;
    active_applications: any[];
    color: string;
    created_at: string;
    is_disbanded: boolean;
    recruiting_restrictions: RecruitingRestrictions;
    motto: string;
    is_suited_for_autorecruiting: boolean;
    name: string;
    tag: string;
    community_urls: CommunityUrls;
    description: string;
    recruiting_policy: string;
}

export interface ClanBaseBuilding {
    name: string;
    level: number;
    modifiers: number[];
    id: number;
}

export interface ClanBaseWowsLadderMaxPosition {
    league: number;
    division_rating: number;
    division: number;
    public_rating: number;
}

export interface ClanBaseWowsLadderRating {
    stage: any;
    is_qualified: boolean;
    battles_count: number;
    id: number;
    max_position: ClanBaseWowsLadderMaxPosition;
    division_rating_max: number;
    is_best_season_rating: boolean;
    realm: string;
    last_win_at: string;
    team_number: number;
    division_rating: number;
    wins_count: number;
    league: number;
    status: string;
    current_winning_streak: number;
    public_rating: number;
    season_number: number;
    longest_winning_streak: number;
    division: number;
    max_public_rating: number;
    initial_public_rating: number;
}

export interface ClanBaseWowsLadder {
    rating_realm: any;
    is_qualified: boolean;
    last_battle_at: string;
    members_count: number;
    battles_count: number;
    id: number;
    max_position: ClanBaseWowsLadderMaxPosition;
    leading_team_number: number;
    division_rating_max: number;
    prime_time: number;
    ratings: ClanBaseWowsLadderRating[];
    is_best_season_rating: boolean;
    realm: string;
    last_win_at: string;
    team_number: number;
    division_rating: number;
    wins_count: number;
    league: number;
    status: string;
    total_battles_count: number;
    current_winning_streak: number;
    public_rating: number;
    season_number: number;
    longest_winning_streak: number;
    division: number;
    max_public_rating: number;
    initial_public_rating: number;
}

export interface ClanBaseData {
    clanview: {
        achievements: Achievement[];
        clan: ClanBaseClan;
        buildings: { [key: string]: ClanBaseBuilding };
        wows_ladder: ClanBaseWowsLadder;
    };
    _meta_: {
        model: string;
    };
}

// Function to fetch data from the API
async function fetchData(clanID: number): Promise<ClanBaseData> {
    let clanIdToUse;

    if (clanID === 1) {
        clanIdToUse = CLAN_ID;
    } else if (clanID === 2) {
        clanIdToUse = CLAN_ID2;
    } else if (clanID === 3) {
        clanIdToUse = CLAN_ID3;
    } else {
        throw new Error('Invalid clan ID provided');
    }

    const response = await fetch(`https://clans.worldofwarships.asia/api/clanbase/${clanIdToUse}/claninfo/`);
    const data: ClanBaseData = await response.json();
    return data;
}

// Function to extract the current season data excluding the 'ratings' property
function extractCurrentSeasonData(clanBaseData: ClanBaseData): Omit<ClanBaseWowsLadder, 'ratings'> {
    const { ratings, ...currentSeasonData } = clanBaseData.clanview.wows_ladder;
    return currentSeasonData;
}

// Main function to execute the retrieval
export async function fetchClanWebCBInfo(clanID: number) {
    try {
        const clanBaseData = await fetchData(clanID);
        const currentSeasonData = extractCurrentSeasonData(clanBaseData);
        console.log(currentSeasonData); // or use the data as needed
        return currentSeasonData;
    } catch (error) {
        console.error('Error fetching clan data:', error);
    }
}
