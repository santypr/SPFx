declare interface ISpsDesignWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  SettingsGroupName: string;
  DescriptionFieldLabel: string;
  ListsFieldLabel: string;
  ViewModeFieldLabel: string;
}

declare module 'SpsDesignWebPartStrings' {
  const strings: ISpsDesignWebPartStrings;
  export = strings;
}
