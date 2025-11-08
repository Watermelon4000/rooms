export const DEFAULT_GRID_SIZE = 20;
export const TILE_SIZE = 32;

export type Profile = {
  id: string;
  username: string | null;
};

export type Room = {
  id: string;
  owner: string;
  title: string;
  is_public: boolean;
  grid_size: number;
  created_at?: string;
  updated_at?: string;
};

export type ItemCatalogEntry = {
  id: string;
  label: string;
  icon: string;
  solid: boolean;
};

export type RoomTile = {
  room_id: string;
  x: number;
  y: number;
  item_id: string;
  meta: Record<string, unknown>;
};

export type TileWithItem = RoomTile & {
  item?: ItemCatalogEntry;
};

export type TileOperation =
  | {
      x: number;
      y: number;
      itemId: string;
      meta?: Record<string, unknown>;
    }
  | {
    x: number;
    y: number;
    remove: true;
  };
