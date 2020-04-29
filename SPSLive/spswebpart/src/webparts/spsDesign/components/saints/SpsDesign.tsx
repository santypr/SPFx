import * as React from 'react';
import styles from './SpsDesign.module.scss';
import { ISpsDesignProps } from './ISpsDesignProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISaintProps, ISaints, ISaint, saintsList } from '../../../model/ISaint';
import { Rating, RatingSize, IRatingStyles } from 'office-ui-fabric-react/lib/Rating';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { PropertyPaneSlider } from '@microsoft/sp-property-pane';

const Saint = (props: ISaint, key: number) => {
  let strengthColor = "#b08d57";
  if (props.saint.class === 'Silver') {
    strengthColor = "#374f6b";
  } else if (props.saint.class === 'Gold') {
    strengthColor = "#d4af37";
  } else if (props.saint.class === 'Legendary') {
    strengthColor = "#2e1733";
  }

  return (
    <>
      <li key={key} className="saint-container" style={{ backgroundImage: `url(${props.saint.picture})` }}>
        <div className={styles.saintPicture} style={{ backgroundImage: `url(${props.saint.picture})` }}></div>
        <div className={styles.saintName}>{props.saint.name}</div>
        <div className="saint-constellation">{props.saint.constellation !== '' ? props.saint.constellation : '-' }</div>
        <div className="saint-class">{props.saint.class}</div>
        <div className="saint-strength"><span className={styles.galleryOnly}>Strength: </span>{props.saint.strength}</div>
        <Rating
            min={1}
            max={5}
            size={RatingSize.Large}
            rating={props.saint.strength / 4.5}
            readOnly={true}
            ariaLabelFormat={'{0} of {1} strength level'}
            styles={{ratingStarFront: {color: strengthColor}, ratingStarBack: {color: "#f0f0f0"}}}
          />
      </li>
    </>
  );
};

interface IListProps {
  viewMode: string;
  saints: ISaintProps[];
}

const SaintList =  (props: IListProps) => {
  const styleViewMode = props.viewMode === 'GALLERY' ? styles.GALLERY : styles.LIST;

  return (
    <>
      <ul className={styleViewMode}>
        <li key={-1} className={[styles.listOnly, styles.listHeader].join(' ')}>
          <div></div>
          <div>Saint</div>
          <div>Constellation</div>
          <div>Class</div>
          <div>Strength</div>
          <div></div>
          {/* 
            Descomentar para mostrar cómo integrar controles de Fluent UI dentro de SPFx
            <div><Checkbox label="Unchecked checkbox (uncontrolled)" /></div> 
          */}
        </li>

        {props.saints.map((item, index) => {
          return (<Saint saint={item} key={index} />);
        })}
      </ul>
    </>
  );
};

interface IDashboardProps {
  saints: number;
  bronzeSaints: number;
  silverSaints: number;
  goldSaints: number;
  legendarySaints: number;
  strengthAvg: number;
}

const Dashboard = (props: IDashboardProps) => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.kpiRow}>
        <div className={styles.kpiPanel}>
          <div className={styles.kpiTitle}>Saints:</div><div className={styles.kpiValue}>{props.saints}</div>
        </div>
        <div className={styles.kpiPanel}>
          <div className={styles.kpiTitle}>Strength average:</div><div className={styles.kpiValue}>{props.strengthAvg}</div>
          </div>
      </div>
      <div className={styles.kpiRow}>
        <div className={styles.kpiPanel}>
          <div className={styles.kpiTitle}>Bronze Saints:</div><div className={styles.kpiValue}>{props.bronzeSaints}</div>
        </div>
        <div className={styles.kpiPanel}>
          <div className={styles.kpiTitle}>Silver Saints:</div><div className={styles.kpiValue}>{props.silverSaints}</div>
        </div>
        <div className={styles.kpiPanel}>
          <div className={styles.kpiTitle}>Gold Saints:</div><div className={styles.kpiValue}>{props.goldSaints}</div>
        </div>
        <div className={styles.kpiPanel}>
          <div className={styles.kpiTitle}>Legendary Saints:</div><div className={styles.kpiValue}>{props.legendarySaints}</div>
        </div>
      </div>
    </div>
  );
};

function getAverage(saints: ISaintProps[]) {
  let sum = 0;
  let avg = 0;

  saints.forEach(item => {
    sum += item.strength;
  });

  avg = Math.round((sum / saints.length) * 100) / 100;
  
  return avg;
}

interface IFilterProps {
  saints: ISaintProps[];
  handleFilter: (key:string) => any;
}

const Filter = (props: IFilterProps) => {
  const options: IDropdownOption[] = [
    { key: 'All', text: 'All Saints' },
    { key: 'Bronze', text: 'Bronze' },
    { key: 'Silver', text: 'Silver' },
    { key: 'Gold', text: 'Gold' },
    { key: 'Legendary', text: 'Legendary' }
  ];
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

  function onSelectClass (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) {
    if (option != null) {
      props.handleFilter(option.key.toString());
    }
  }

  return (
    <>
      <Dropdown
        placeholder="All Saints"
        defaultSelectedKeys={["All"]}
        label="Filter Saints"
        options={options}
        styles={dropdownStyles}
        onChange={onSelectClass} />
    </>
  );
};

interface ISPSDesignState {
  saintsFiltered: ISaintProps[];
  styleViewMode: string;
  viewMode: string;
}

export default class SpsDesign extends React.Component<ISpsDesignProps, ISPSDesignState> {
  constructor(props) {
    super(props);
    this.state = { 
      saintsFiltered: saintsList.saints, 
      styleViewMode: this.props.viewMode === 'GALLERY' ? styles.GALLERY : styles.LIST,
      viewMode: this.props.viewMode === 'GALLERY' ? styles.GALLERY : styles.LIST      
    };
    this.FilterSaints = this.FilterSaints.bind(this);
    this.setViewMode = this.setViewMode.bind(this);
  }

  public FilterSaints(key: string) {
    if (key === 'All') {
      this.setState(() => {  
        return { saintsFiltered: saintsList.saints };  
      });
    } else {
      this.setState(() => {  
        return { saintsFiltered: saintsList.saints.filter((saint) => { return saint.class === key;}) };  
      });
    }
  }

  private setViewMode(newViewMode: string) {
    this.setState({
      viewMode: newViewMode,
      styleViewMode: newViewMode === 'GALLERY' ? styles.GALLERY : styles.LIST
    });
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (prevState.viewMode !== nextProps.viewMode) {
  //     return {
  //       viewMode: nextProps.viewMode,
  //       styleViewMode: nextProps.viewMode === 'GALLERY' ? styles.GALLERY : styles.LIST
  //     }
  //   }
  //   return null;
  // }

  public render(): React.ReactElement<ISpsDesignProps> {
    const styleViewMode = this.props.viewMode === 'GALLERY' ? styles.GALLERY : styles.LIST;
    const average = 0;
    const _items: ICommandBarItemProps[] = [
      {
        key: 'newItem',
        text: 'New',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: { iconName: 'Add' },
        subMenuProps: {
          items: [
            {
              key: 'emailMessage',
              text: 'Email message',
              iconProps: { iconName: 'Mail' },
              ['data-automation-id']: 'newEmailButton', // optional
            },
            {
              key: 'calendarEvent',
              text: 'Calendar event',
              iconProps: { iconName: 'Calendar' },
            },
          ],
        },
      },
      {
        key: 'upload',
        text: 'Upload',
        iconProps: { iconName: 'Upload' },
        href: 'https://developer.microsoft.com/en-us/fluentui',
      },
      {
        key: 'share',
        text: 'Share',
        iconProps: { iconName: 'Share' },
        onClick: () => console.log('Share'),
      },
      {
        key: 'download',
        text: 'Download',
        iconProps: { iconName: 'Download' },
        onClick: () => console.log('Download'),
      },
    ];
    const _overflowItems: ICommandBarItemProps[] = [
      { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
      { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
      { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
    ];
    const _farItems: ICommandBarItemProps[] = [
      {
        key: 'tile',
        text: 'Grid view',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Grid view',
        iconOnly: true,
        iconProps: { iconName: 'Tiles' },
        onClick: () => {
          console.log('Tiles'); 
          console.log(this.state.viewMode);
          if (this.state.viewMode === 'GALLERY') {
            this.setViewMode('LIST');
          } else { 
            this.setViewMode('GALLERY');
          }
        },
      },
      {
        key: 'info',
        text: 'Info',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Info',
        iconOnly: true,
        iconProps: { iconName: 'Info' },
        onClick: () => console.log('Info'),
      },
    ];
    const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

    return (
      <>
        <div className={[styles.saintsContainer, this.state.styleViewMode].join(' ')}>
          <CommandBar
            items={_items}
            overflowItems={_overflowItems}
            overflowButtonProps={overflowProps}
            farItems={_farItems}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          />
          <Dashboard 
            saints={this.state.saintsFiltered.length}
            bronzeSaints={6}
            silverSaints={6}
            goldSaints={12}
            legendarySaints={6}
            strengthAvg={getAverage(this.state.saintsFiltered)}
          />
          <Filter saints={this.state.saintsFiltered} handleFilter={this.FilterSaints} />
          <SaintList saints={this.state.saintsFiltered} viewMode={this.state.viewMode}/>
        </div>
      </>
    );
  }
}
