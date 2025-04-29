import React, { useState } from "react";

import styles from "./ToggleButton.module.scss";

interface ToggleButtonProps extends React.HTMLAttributes<HTMLLabelElement> {
  options?: string[];
  isActive: boolean;
}

/**
 * Currently this toggle button is being used in Validations View.
 * If it´s required in another view, it should be checked to not break their styles.
 * @param options have two default values, inactive and active. It can be modify,
 * but it's taught to be use with only two values.
 * @returns
 */
export const ToggleButton = ({
  options = ["Inactivo", "Activo"],
  isActive = false,
  ...props
}: ToggleButtonProps) => {
  const [index, setIndex] = useState(+isActive);
  return (
    <label className={styles.switch} {...props}>
      <input
        type="checkbox"
        onChange={() => setIndex((index + 1) % 2)}
        checked={index === 1}
      />
      <span className={`${styles.slider} ${styles.round}`}></span>
      <span className={styles.text}>{options[index]}</span>
    </label>
  );
};
