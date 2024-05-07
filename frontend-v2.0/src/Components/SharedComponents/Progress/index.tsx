import React from "react";
import './style.css';
import { useTranslation } from "react-i18next";
import { Level } from "src/api/constants";

const Progress = ({ done }) => {
  const { t } = useTranslation(['main'])
  const [style, setStyle] = React.useState({});

  React.useEffect(() => {
    setTimeout(() => {
      const newStyle = {
        opacity: 1,
        width: `${(done > 0 ? done : done + 1) * 20}%`
      }

      setStyle(newStyle);
    }, 200);
  }, [])

  return (
    <div className="progress">
      <div className="progress-done" style={style}>
        {t(`${Level[done - 1]}`)}
      </div>
    </div>
  )
}

export default Progress;
