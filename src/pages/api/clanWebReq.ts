const CLAN_ID = import.meta.env.API_CLANID;
const CLAN_ID2 = import.meta.env.API_CLANID2;
const CLAN_ID3 = import.meta.env.API_CLANID3; //YOR

const APPLICATION_ID = import.meta.env.API_APPLICATIONID;
const APPLICATION_ID2 = import.meta.env.API_APPLICATIONID2;

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

// Types for Glossary Data
export interface BuildingType {
    building_type_id: number;
    name: string;
}

export interface Building {
    name: string;
    bonus_value: number;
    ship_tier: number | null;
    bonus_type: string;
    cost: number;
    ship_type: string | null;
    building_type_id: number;
    building_id: number;
    ship_nation: string | null;
}

export interface GlossaryData {
    building_types: { [key: string]: BuildingType };
    buildings: { [key: string]: Building };
}

// Types for Clan Web Data
export interface ClanBuilding {
    id: number;
    modifiers: number[];
    name: string;
    level: number;
    building_type_id: number; // Add this property
}

export interface ClanData {
    buildings: { [key: string]: ClanBuilding };
}

// Processed Building Data
export interface ProcessedBuilding {
    name: string;
    level: number;
    activeModifiers: { bonusType: string; totalBonusValue: number }[];
}


// Fetch Glossary Data
export async function fetchGlossary(): Promise<GlossaryData> {
    const response = await fetch(
        `https://api.worldofwarships.asia/wows/clans/glossary/?application_id=${APPLICATION_ID}&language=en`
    );
    const data = await response.json();

    if (data.status !== "ok") {
        throw new Error("Failed to fetch glossary data.");
    }

    return data.data;
}

// Fetch Clan Web Data
export async function fetchClanWebData(region : string, clanId: number): Promise<ClanData> {
    let domain : string;

    switch (region) {
        case 'asia':
            domain = 'asia';
            break;
        case 'eu':
            domain = 'eu';
            break;
        case 'na':
            domain = 'com';
            break;
        default:
      throw new Error('Invalid region specified');
    }

    const response = await fetch(
        `https://clans.worldofwarships.${domain}/api/clanbase/${clanId}/claninfo/`
    );
    const data = await response.json();

    return data.clanview;
}

function translateBuildingName(name: string): string {
    const translations: { [key: string]: string } = {
        dry_dock: "Dry Dock",
        university: "War College",
        academy: "Academy",
        design_department: "Design Bureau",
        shipbuilding_factory: "Shipbuilding Yard",
        monument: "Rostral Column",
        coal_yard: "Coal Port",
        treasury: "Treasury",
        vessels: "Auxiliary Fleet",
        ships: "Battle Fleet at Anchor",
        headquarters: "Officers' Club",
        steel_yard: "Steel Port",
        superships_home: "Special Projects Complex",
        paragon_yard: "Research Institute",
    };

    // Return the translated name or the original if no translation exists
    return translations[name] || name;
}

  
// Define the required building order
const buildingOrder = [
    'War College',
    'Academy',
    'Design Bureau',
    'Shipbuilding Yard',
    'Dry Dock',
    'Special Projects Complex',
    'Coal Port',
    'Steel Port',
    'Research Institute',
    'Treasury',
    'Officers\' Club',
    'Auxiliary Fleet',
    'Battle Fleet at Anchor',
    'Rostral Column'
  ];
  
  // Define all possible buildings that should be present
const allPossibleBuildings = [
    'monument', 'dry_dock', 'shipbuilding_factory', 'university', 'treasury',
    'design_department', 'academy', 'vessels', 'ships', 'coal_yard', 
    'headquarters', 'steel_yard', 'superships_home', 'paragon_yard'
  ];
  
  // Fetch Clan Web Data
  export async function processClanModifiers(region: string, clanId: number) {
    try {
      const glossary = await fetchGlossary();
      const clanData = await fetchClanWebData(region, clanId);
      const glossaryBuildings = glossary.buildings;
  
      // Function to get max level of a building
      const getMaxLevel = (buildingTypeId: number): number => {
        const relevantBuildings = Object.values(glossaryBuildings).filter(
          (building) => building.building_type_id === buildingTypeId
        );
  
        let maxLevel = 0;
  
        relevantBuildings.forEach((building) => {
          const levelMatch = building.name.match(/lvl_(\d+)/);
          if (levelMatch) {
            const level = parseInt(levelMatch[1], 10);
            maxLevel = Math.max(maxLevel, level);
          }
        });
  
        return maxLevel;
      };
  
      // Translate bonus types to human-readable descriptions
      const translateBonusType = (bonusType: string, bonusValue: number, building: any) => {
        switch (bonusType) {
          case 'exp_boost':
            return `+${bonusValue}% XP per battle`;
          case 'commander_exp_boost':
            return `+${bonusValue}% Commander XP per battle`;
          case 'free_exp_boost':
            return `+${bonusValue}% Free XP per battle`;
          case 'purchase_discount':
            return `-${bonusValue}% to the cost of researchable ships`;
          case 'maintenance_discount':
            return `-${bonusValue}% to the post-battle service costs`;
          case 'coal_boost':
            return `+${bonusValue}% to the Coal you receive`;
          case 'steel_boost':
            return `+${bonusValue}% to the Steel you receive`;
          case 'paragon_exp_boost':
            return `+${bonusValue}% to Research Points earned`;
          case 'members_count':
            return `Maximum Clan size: ${bonusValue}`;
          case 'vanity': {
            const buildingTypeId = building.building_type_id ?? glossaryBuildings[building.modifiers[0]]?.building_type_id;
            const maxLevel = buildingTypeId ? getMaxLevel(buildingTypeId) : 0;
            return `Expansions: ${building.level} out of ${maxLevel}`;
          }
          default:
            return `${bonusType}: ${bonusValue}%`;
        }
      };
  
      // Process all buildings
      const processedBuildings = allPossibleBuildings.map((buildingType) => {
        // Check if the building exists in the clan data
        const buildingData = clanData.buildings[buildingType] || {
          name: buildingType,
          level: 0,
          modifiers: [],
          id: 0,
          building_type_id: glossaryBuildings[buildingType]?.building_type_id ?? null // Default to glossary's building_type_id
        };
  
        const modifiers = buildingData.modifiers;
        const bonusMap: { [key: string]: number } = {};
  
        modifiers.forEach((modifierId) => {
          const modifierData = glossaryBuildings[modifierId];
          if (modifierData) {
            const { bonus_type, bonus_value } = modifierData;
  
            if (bonusMap[bonus_type] !== undefined) {
              bonusMap[bonus_type] = Math.max(bonusMap[bonus_type], bonus_value);
            } else {
              bonusMap[bonus_type] = bonus_value;
            }
          }
        });
  
        const activeModifiers = Object.entries(bonusMap).map(([bonusType, totalBonusValue]) =>
          translateBonusType(bonusType, totalBonusValue, buildingData)
        );
  
        return {
          name: buildingData.name,
          level: buildingData.level,
          translatedName: translateBuildingName(buildingData.name),
          building_type_id: buildingData.building_type_id,
          activeModifiers,
        };
      });
  
      // Sort the processed buildings based on the predefined order
      const sortedBuildings = processedBuildings.sort((a, b) => {
        const indexA = buildingOrder.indexOf(a.translatedName);
        const indexB = buildingOrder.indexOf(b.translatedName);
  
        // If a building is not in the order list, keep it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
  
        return indexA - indexB;
      });
  
      console.log('Sorted Buildings:', sortedBuildings);
      return sortedBuildings;
    } catch (error) {
      console.error('Error processing clan modifiers:', error);
      throw error;
    }
  }
  
  