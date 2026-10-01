import type { SphereListItemProps } from "./SphereListItem.props"
import styles from './SphereListItem.module.scss';

export const SphereListItem = ({ sphere }: SphereListItemProps) => {
    return (
        <div className={styles.wrapper}>
            {sphere.title}
        </div>
    )
}