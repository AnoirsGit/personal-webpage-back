import { ColumnType, Generated } from "kysely";

export type Database = {
  users: UsersTable;
  locations: LocationsTable;
  contacts: ContactsTable;
  skill_trees: SkillTreesTable;
  nodes: NodesTable;
  edges: EdgesTable;
  experiences: ExperiencesTable;
};

export type UsersTable = {
  id: Generated<number>;
  name: string;
  password: string;
  location_id: number;
  job_title: string | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type LocationsTable = {
  id: Generated<number>;
  country_name: string;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  continent_name: string;
};

export type ContactsTable = {
  id: Generated<number>;
  email: string;
  phone: string;
  linkedin_url: string;
  telegram_url: string;
  cv_url: string | null;
  telegram_tag: string;
  github_url: string;
  github_tag: string;
  user_id: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type SkillTreesTable = {
  id: Generated<number>;
  title: string;
};

export type NodesTable = {
  id: Generated<number>;
  tree_id: number;
  title: string;
  description: string | null;
  is_node: boolean;
  tags: string[];
  position_x: number;
  position_y: number;
};

export type EdgesTable = {
  id: Generated<number>;
  tree_id: number;
  source_node_id: number;
  target_node_id: number;
};

export type ExperiencesTable = {
  id: Generated<number>;
  color: string;
  title: string;
  position: string;
  place: string;
  base_description: string;
  tags: string[];
  start_date: Date;
  end_date: Date | null ;
  user_id: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};
