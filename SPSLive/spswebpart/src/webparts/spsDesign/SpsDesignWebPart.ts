import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

import * as strings from 'SpsDesignWebPartStrings';
import SpsDesign from './components/saints/SpsDesign';
import { ISpsDesignProps } from './components/saints/ISpsDesignProps';

export interface ISpsDesignWebPartProps {
  description: string;
  list: string;
  viewMode: string;
}

export default class SpsDesignWebPart extends BaseClientSideWebPart<ISpsDesignWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpsDesignProps > = React.createElement(
      SpsDesign,
      {
        description: this.properties.description,
        list: this.properties.list,
        viewMode: this.properties.viewMode
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            },
            {
              groupName: strings.SettingsGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneDropdown('list', {
                  label: strings.ListsFieldLabel,
                  options: [
                    {key: 'sharedDocuments', text: 'Shared Documents'},
                    {key: 'myDocuments', text: 'My Documents'}
                  ],
                  selectedKey: 'sharedDocuments'
                }),
                PropertyPaneDropdown('viewMode', {
                  label: strings.ViewModeFieldLabel,
                  options: [
                    {key: 'GALLERY', text: 'Gallery'},
                    {key: 'LIST', text: 'List'}
                  ],
                  selectedKey: 'LIST'
                }),
              ]
            }
          ]
        },
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.SettingsGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneDropdown('list', {
                  label: strings.ListsFieldLabel,
                  options: [
                    {key: 'sharedDocuments', text: 'Shared Documents'},
                    {key: 'myDocuments', text: 'My Documents'}
                  ],
                  selectedKey: 'sharedDocuments'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
