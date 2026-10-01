import type { SphereListProps } from "./SphereList.props"
import styles from './SphereList.module.scss';
import { SphereListItem } from "../SphereListItem";

export const SphereList = ({ items }: SphereListProps) => {
    return (
        <div className={styles.wrapper}>
            {items.map(item => {
                return (
                    <SphereListItem sphere={item} />
                )
            })}
        </div>
    )
}