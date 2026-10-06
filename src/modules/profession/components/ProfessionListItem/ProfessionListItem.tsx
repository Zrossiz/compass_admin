import type { ProfessionListItemProps } from "./ProfessionListItem.props"
import styles from './ProfessionListItem.module.scss';

export const ProfessionListItem = ({ profession }: ProfessionListItemProps) => {
    
    return (
        <div className={styles.wrapper}>
            <span>{profession.title}</span>
        </div>
    )
}