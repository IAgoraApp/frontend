import Action from './action';
import styles from '../../styles/household.module.css';
import leaves from '../../assets/images/household/plant-leaves.svg';
import pot from '../../assets/images/household/plant-pot.svg';
import soil from '../../assets/images/household/plant-soil.svg';
import box from '../../assets/images/household/box.svg';
import packingTape from '../../assets/images/household/packing-tape.svg';
import handle from '../../assets/images/household/box-handle.svg';
import boxLabel from '../../assets/images/household/box-label.svg';
import opening from '../../assets/images/household/box-opening.svg';
import doodle from '../../assets/images/household/doodle.svg';
import paperTape from '../../assets/images/household/paper-tape.svg';

// These are the original Figma SVG layers at their exported dimensions.
function Illustration({ movingBox }) {
  return movingBox ? (
    <div className={styles.movingBox}>
      <img
        src={box}
        className={styles.boxBody}
        alt=''
        width={199.333}
        height={153.334}
      />
      <img
        src={packingTape}
        className={styles.boxTape}
        alt=''
        width={87.5}
        height={61.5}
      />
      <img
        src={handle}
        className={styles.boxHandle}
        alt=''
        width={120.335}
        height={13.3353}
      />
      <img
        src={boxLabel}
        className={styles.boxLabel}
        alt=''
        width={27.1429}
        height={20.1429}
      />
      <img
        src={opening}
        className={styles.boxOpening}
        alt=''
        width={37.8338}
        height={26.3334}
      />
    </div>
  ) : (
    <div className={styles.plant}>
      <img
        src={leaves}
        className={styles.leaves}
        alt=''
        width={134.687}
        height={171.516}
      />
      <img
        src={pot}
        className={styles.pot}
        alt=''
        width={114.8}
        height={95.8577}
      />
      <img
        src={soil}
        className={styles.soil}
        alt=''
        width={81.1217}
        height={9.3717}
      />
    </div>
  );
}

export default function HeroSection({
  eyebrow,
  title,
  highlight,
  description,
  action,
  primaryPhoto,
  secondaryPhoto,
  reversed = false,
  cleaning = false,
  tape = 'UM PASSO DE CADA VEZ ↗',
  headingAs: Heading = 'h1',
}) {
  return (
    <section
      aria-label={`${title} ${highlight}`}
      className={`${styles.hero} ${reversed ? styles.heroReversed : ''} ${cleaning ? styles.cleaningHero : ''}`}
    >
      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}>{eyebrow}</p>
        <Heading className={styles.heroTitle}>
          <span>{title}</span>
          <span className={styles.paperWrapper}>
            <span className={styles.orangePaper}>{highlight}</span>
          </span>
        </Heading>
        <p className={styles.heroDescription}>{description}</p>
        <div className={styles.heroAction}>
          <Action {...action}>{action.label}</Action>
        </div>
      </div>
      <div className={styles.collage} aria-hidden='true'>
        <div className={styles.collageStage}>
          <div className={styles.primaryPhoto}>
            <img
              src={primaryPhoto}
              alt=''
              width={cleaning ? 410 : 300}
              height={cleaning ? 300 : 375}
              fetchPriority='high'
            />
          </div>
          <div className={styles.secondaryPhoto}>
            <img
              src={secondaryPhoto}
              alt=''
              width={cleaning ? 245 : 230}
              height={cleaning ? 180 : 164}
            />
          </div>
          <Illustration movingBox={cleaning} />
          <div className={styles.orangeTape}>seu canto ganha vida ↗</div>
          <img
            className={styles.doodle}
            src={doodle}
            alt=''
            width={150}
            height={85}
          />
          <img
            className={styles.paperTape}
            src={paperTape}
            alt=''
            width={110}
            height={30}
          />
        </div>
      </div>
      <div className={styles.navyTape}>{tape}</div>
    </section>
  );
}
