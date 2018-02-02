export interface Navigation {
}

export interface NavigationNode {
    url?: string;
    title?: string;
    tooltip?: string;
    hidden?: boolean;
    children?: NavigationNode[];
  }

export interface NavigationViews {
    [name: string]: NavigationNode[];
}

export interface CurrentNode {
    url: string;
    view: string;
    nodes: NavigationNode[];
}

export interface CurrentNodes {
    [view: string]: CurrentNode;
}