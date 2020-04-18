import * as React from 'react';
import styles from './SpsDesign.module.scss';
import { ISpsDesignProps } from './ISpsDesignProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISaintProps, ISaints, ISaint, saintsList } from '../../../model/ISaint';
import { Rating, RatingSize, IRatingStyles } from 'office-ui-fabric-react/lib/Rating';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

const Saint = (props: ISaint) => {
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
      <li className="saint-container" style={{ backgroundImage: `url(${props.saint.picture})` }}>
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
        <li className={[styles.listOnly, styles.listHeader].join(' ')}>
          <div></div>
          <div>Saint</div>
          <div>Constellation</div>
          <div>Class</div>
          <div>Strength</div>
          <div></div>
          {/* <div><Checkbox label="Unchecked checkbox (uncontrolled)" /></div> */}
        </li>

        {props.saints.map((item, index) => {
          return (<Saint saint={item} />);
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

  saintsList.saints.forEach(item => {
    sum += item.strength;
  });

  avg = Math.round((sum / saints.length) * 100) / 100;
  
  return avg;
}

export default class SpsDesign extends React.Component<ISpsDesignProps, {}> {
  public render(): React.ReactElement<ISpsDesignProps> {
    const styleViewMode = this.props.viewMode === 'GALLERY' ? styles.GALLERY : styles.LIST;
    const average = 0;

    return (
      <>
        <div className={[styles.saintsContainer, styleViewMode].join(' ')}>
          <Dashboard 
            saints={saintsList.saints.length}
            bronzeSaints={6}
            silverSaints={6}
            goldSaints={12}
            legendarySaints={6}
            strengthAvg={getAverage(saintsList.saints)}
          />
          <SaintList saints={saintsList.saints} viewMode={this.props.viewMode}/>
        </div>
      </>
    );
  }
}
