export const uiIntents = ["primary", "secondary", "tertiary","darkInk" , "lightInk"] as const;
export type UIIntent = (typeof uiIntents)[number];

export const uiComponentSizes = ["sm", "md", "lg"] as const;
export type UISize = (typeof uiComponentSizes)[number];

export const uiAppearances = ["filled", "outlined", "text"] as const;
export type UIAppearance = (typeof uiAppearances)[number];

export type UIStyleProps = {
  intent?: UIIntent;
  size?: UISize;
  appearance?: UIAppearance;
};

// ~~~~~~~~~~~~~~~~~~

export type DisableProps = {
  disabled?: boolean;
};

export type SelectableProps = {
  selected?: boolean;
};

export type HideableProps = {
  hidden?: boolean;
};

export type LoadableProps = {
  loading?: boolean;
};

export type CheckableProps = {
  checked?: boolean;
};

export type OpenableProps = {
  open?: boolean;
};
